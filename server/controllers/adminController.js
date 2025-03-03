const userModel = require("../models/users");
const teamModel = require("../models/teams");
const { CustomHttpError } = require("../utils/customError");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const designationModel = require("../models/designations");
const contactModel = require("../models/contacts");
const { sendEmail } = require("../utils/sendMail");
const catchAsyncError = require("../middleware/catchAsyncError");

const registerUser = catchAsyncError(async (req, res, next) => {
  const {
    email,
    fullname,
    permissions = [],
    designations = [],
    teams = [],
  } = req.body;
  const user = await userModel.findOne({ email, is_active: 1 });
  if (user) {
    return next(new CustomHttpError(400, "User with this mail already exists"));
  }
  if (!email || !fullname) {
    return next(new CustomHttpError(400, "Enter valid inputs"));
  }
  const newUser = new userModel({
    email,
    fullname,
    permissions,
    designations,
    teams,
  });
  for (const designationId of designations) {
    let designation = await designationModel.findById(designationId);
    for (const permission of designation.permissions) {
      newUser.permissions.push(permission);
    }
  }
  for (const teamId of teams) {
    let team = await teamModel.findById(teamId);
    for (const permission of team.permissions) {
      newUser.permissions.push(permission);
    }
  }
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

const getUsers = catchAsyncError(async (req, res, next) => {
  const users = await userModel
    .find({
      is_active: 1,
      _id: { $ne: req.user._id },
    })
    .populate("designations")
    .populate("teams");
  res.status(200).json({ success: true, data: users });
});

const editUser = catchAsyncError(async (req, res, next) => {
  const { permissions = [], designations, fullname, teams = [] } = req.body;
  if (!fullname) {
    return next(new CustomHttpError(400, "Give fullname of user"));
  }
  if (!designations?.length) {
    return next(new CustomHttpError(400, "Assign a designation to user"));
  }
  const { userId } = req.params;
  const user = await userModel.findById(userId);
  if (!user) {
    return next(new CustomHttpError(400, "User does not exist"));
  }
  for (const teamId of user.teams) {
    let team = await teamModel.findById(teamId);
    if (team?.permissions) {
      for (const permission of team?.permissions) {
        const index = user?.permissions.indexOf(permission);
        if (index !== -1) {
          user.permissions.splice(index, 1);
        }
      }
    }
  }

  for (const designationId of user?.designations) {
    let designation = await designationModel.findById(designationId);
    if (designation.permissions) {
      for (const permission of designation.permissions) {
        const index = user.permissions.indexOf(permission);
        if (index !== -1) {
          user.permissions.splice(index, 1);
        }
      }
    }
  }
  user.teams = teams;
  user.permissions = permissions;
  user.designations = designations;
  user.fullname = fullname;
  if (designations?.length) {
    for (const designationId of designations) {
      let designation = await designationModel.findById(designationId);
      for (const permission of designation?.permissions) {
        user.permissions.push(permission);
      }
    }
  }
  if (teams?.length) {
    for (const teamId of teams) {
      let team = await teamModel.findById(teamId);
      for (const permission of team?.permissions) {
        user.permissions.push(permission);
      }
    }
  }
  await user.save();
  res.status(200).json({
    success: true,
  });
});

const deleteUser = catchAsyncError(async (req, res, next) => {
  const { userId } = req.params;
  let user = await userModel.findById(userId);
  if (!user) {
    return next(new CustomHttpError(400, "User does not exists"));
  }
  user.is_active = 0;
  await user.save();
  res.status(200).json({ success: true });
});

const addDesignation = catchAsyncErrors(async (req, res, next) => {
  const { name, permissions } = req.body;
  if (!name) {
    return next(new CustomHttpError(400, "Please write designation"));
  }
  if (!permissions?.length) {
    return next(new CustomHttpError(400, "Please write permissions"));
  }
  const existingDesignation = await designationModel.findOne({ name });
  if (existingDesignation) {
    return next(
      new CustomHttpError(400, "Designation with this name already exists")
    );
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
  if (!designation) {
    return next(new CustomHttpError(400, "Designation does not exist"));
  }
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
  if (!designation) {
    return next(new CustomHttpError(400, "Designation does not exist"));
  }
  designation.is_active = 0;
  const users = await userModel.find({
    designations: designationId,
  });
  for (const user of users) {
    const designationIndex = user.designations.indexOf(designationId);
    if (designationIndex != -1) {
      user.designations.splice(designationId, 1);
    }

    for (const per of designation.permissions) {
      const index = user.permissions.indexOf(per);
      if (index !== -1) {
        user.permissions.splice(index, 1);
      }
    }
    await user.save();
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
  const team = await teamModel.find({ name, is_active: 1 });
  if (team.length) {
    return next(new CustomHttpError(400, "Team already exists"));
  }
  const newTeam = new teamModel({
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
    user.teams.push(newTeam._id);
    await user.save();
  }
  await newTeam.save();
  res.status(200).json({
    success: true,
    data: newTeam,
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
  if (!name || !permissions?.length || !members?.length) {
    return next(new CustomHttpError(400, "Please enter valid input"));
  }
  const users = await userModel.find({ teams: teamId });
  const team = await teamModel.findById(teamId);
  if (!team) {
    return next(new CustomHttpError(400, "No team exists"));
  }
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

const getTeams = catchAsyncError(async (req, res, next) => {
  const teams = await teamModel.find({ is_active: 1 }).populate("members");
  res.status(200).json({ success: true, data: teams });
});

const dashboardCounts = catchAsyncError(async (req, res, next) => {
  const teamsCount = await teamModel.countDocuments({ is_active: 1 });
  const designationsCount = await designationModel.countDocuments({
    is_active: 1,
  });
  const contactsCount = await contactModel.countDocuments({ is_active: 1 });
  const usersCount = await userModel.countDocuments({ is_active: 1 });
  res.status(200).json({
    success: true,
    data: {
      teamsCount,
      designationsCount,
      contactsCount,
      usersCount,
    },
  });
});

module.exports = {
  addDesignation,
  registerUser,
  getUsers,
  editUser,
  editDesignation,
  deleteDesignation,
  getDesignations,
  createTeam,
  deleteTeam,
  editTeam,
  getTeams,
  deleteUser,
  dashboardCounts,
};
