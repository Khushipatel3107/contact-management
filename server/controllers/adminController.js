const userModel = require("../models/users");
const teamModel = require("../models/teams");
const { CustomHttpError } = require("../utils/customError");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const designationModel = require("../models/designations");
const { sendEmail } = require("../utils/sendMail");
const catchAsyncError = require("../middleware/catchAsyncError");

const registerUser = catchAsyncError(async (req, res, next) => {
  const { email, fullname, permissions, designations } = req.body;
  const user = await userModel.findOne({ email });
  if (user) {
    return next(new CustomHttpError(400, "User with this mail already exsts"));
  }
  const newUser = new userModel({ email, fullname, permissions, designations });
  await newUser.save();
  const link = `http://localhost:3000/setPassword?user=${newUser._id}`;
  const message = `Please set your password by clicking upon this link: \n\n ${link}`;
  await sendEmail({
    email,
    subject: "Complete signup process",
    message,
  });
  res.status(200).json({
    success: true,
    data: newUser,
  });
});

const addDesignation = catchAsyncErrors(async (req, res, next) => {
  const { name, permissions } = req.body;
  if (!name) {
    return next(new CustomHttpError(400, "Please write designation"));
  }
  if (permissions.length <= 0) {
    return next(new CustomHttpError(400, "Please write permissions"));
  }
  const des = new designationModel({ name, permissions });
  await des.save();
  res.status(200).json({
    success: true,
  });
});

const editDesignation = catchAsyncError(async (req, res, next) => {
  const { name, permissions, designationId } = req.body;
  const designation = await designationModel.findById(designationId);
  const users = await userModel.find({
    designations: designationId,
  });

  for (const user of users) {
    designation.permissions.forEach((per) => {
      const index = user.permissions.indexOf(per);
      if (index !== -1) {
        user.permissions.splice(index, 1);
      }
    });
  }
  designation.name = name;
  designation.permissions = permissions;
  for (const user of users) {
    permissions.forEach((per) => {
      user.permissions.push(per);
    });
    await user.save();
  }

  await designation.save();
  res.status(200).json({
    success: true,
  });
});

const deleteDesignation = catchAsyncError(async (req, res, next) => {
  const { designationId } = req.body;
  const designation = await designationModel.findById(designationId);
  designation.is_active = 0;
  const users = await userModel.find({
    designations: designationId,
  });
  for (const user of users) {
    designation.permissions.forEach(async (per) => {
      const index = user.permissions.indexOf(per);
      if (index !== -1) {
        user.permissions.splice(index, 1);
        await user.save();
      }
    });
  }
  await designation.save();
  res.status(200).json({
    success: true,
  });
});

const getDesignations = catchAsyncError(async (req, res, next) => {
  const designations = await designationModel.find({ is_active: 1 });
  res.status(200).json({
    success: true,
    data: designations,
  });
});

const createTeam = catchAsyncError(async (req, res, next) => {
  const { name, members, permissions } = req.body;
  const teams = await teamModel.find({ name, is_active: 1 });
  if (teams.length) {
    return next(new CustomHttpError(400, "Team already exists"));
  }
  const team = new teamModel({
    name,
    createdBy: req.user._id,
    members,
    permissions,
  });
  for (const person of members) {
    let user = await userModel.findById(person);
    if (!user) {
      return next(new CustomHttpError(400, "User does not exist"));
    }
    for (const permission of permissions) {
      user.permissions.push(permission);
    }
    user.teams.push(team._id);
    await user.save();
  }

  await team.save();
  res.status(200).json({
    success: true,
    data: team,
  });
});

const deleteTeam = catchAsyncError(async (req, res, next) => {
  if (
    req.user.role != "admin" &&
    !req.user.permissions.includes("CREATE_TEAM")
  ) {
    return next(
      new CustomHttpError(401, "User does not have permissions to create team")
    );
  }
  const { teamId } = req.body;
  const team = await teamModel.findById(teamId);
  if (!team) {
    return next(new CustomHttpError(400, "Team does not exists"));
  }
  let users = await userModel.find({ teams: teamId });
  for (let user of users) {
    for (let permission of team.permissions) {
      let index = user.permissions.indexOf(permission);
      if (index !== -1) {
        user.permissions.splice(index, 1);
      }
    }
    await user.save();
  }
  team.is_active = 0;
  await team.save();
  res.status(200).json({
    success: true,
  });
});

const editTeam = catchAsyncError(async (req, res, next) => {
  const { teamId, name, permissions, members } = req.body;
  const users = await userModel.find({ teams: teamId });
  const team = await teamModel.findById(teamId);
  for (let user of users) {
    const teamIndex = user.teams.indexOf(teamId);
    if (teamIndex !== -1) {
      user.teams.splice(teamIndex, 1);
    }
    for (let permission of team.permissions) {
      let index = user.permissions.indexOf(permission);
      if (index !== -1) {
        user.permissions.splice(index, 1);
      }
    }
    await user.save();
  }
  for (let personId of members) {
    let user = await userModel.findById(personId);
    if (!user) {
      return next(new CustomHttpError(400, "User does not exist"));
    }
    for (const permission of permissions) {
      user.permissions.push(permission);
    }
    user.teams.push(teamId);
    await user.save();
  }
  team.name = name;
  team.permissions = permissions;
  team.members = members;
  await team.save();
  res.status(200).json({
    success: true,
  });
});

module.exports = {
  addDesignation,
  registerUser,
  editDesignation,
  deleteDesignation,
  getDesignations,
  createTeam,
  deleteTeam,
  editTeam,
};
