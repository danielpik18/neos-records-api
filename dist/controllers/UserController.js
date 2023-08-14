import UserModel from "../models/UserModel.js";
import bcrypt from 'bcrypt';
export const getAllUsers = async (req, res) => {
  const getPagination = (size, page) => {
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;
    return {
      limit,
      offset
    };
  };

  const getPaginatedData = (data, page, limit) => {
    const {
      count: totalItems,
      rows: users
    } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return {
      totalItems,
      users,
      currentPage,
      totalPages
    };
  };

  try {
    // Get params from the query
    const {
      size,
      page
    } = req.query; // Get limit and offset

    const {
      limit,
      offset
    } = getPagination(size, page);
    const users = await UserModel.findAndCountAll({
      limit,
      offset
    });
    return res.json(getPaginatedData(users, page, limit));
  } catch (error) {
    return res.json({
      message: error.message
    });
  }
};
export const getUser = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      raw: true,
      where: {
        id: req.params.id
      }
    });
    return res.json(user);
  } catch (error) {
    return res.json({
      message: error.message
    });
  }
};
export const getUserById = async id => {
  try {
    const user = await UserModel.findOne({
      raw: true,
      where: {
        id
      }
    });
    return user;
  } catch (error) {
    return error.message;
  }
};
export const getUserByEmail = async email => {
  try {
    const user = await UserModel.findOne({
      raw: true,
      where: {
        email: email
      }
    });
    return user;
  } catch (error) {
    return error.message;
  }
};
export const createUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const createdUser = await UserModel.create({
      name: req.body.name,
      lastname: req.body.lastname,
      email: req.body.email,
      password: hashedPassword
    });
    return res.json({
      message: 'User added correctly!',
      itemCreated: createdUser
    });
  } catch (error) {
    return res.json({
      message: error.message
    });
  }
};
export const updateUser = async (req, res) => {
  try {
    const affectedRows = await UserModel.update(req.body, {
      where: {
        id: req.params.id
      }
    });

    if (affectedRows[0] >= 1) {
      return res.json({
        message: 'User updated correctly!'
      });
    } else {
      return res.json({
        message: 'Record not found or nothing was changed.'
      });
    }
  } catch (error) {
    return res.json({
      message: error.message
    });
  }
};
export const deleteUser = async (req, res) => {
  try {
    await UserModel.destroy({
      where: {
        id: req.params.id
      }
    });
    return res.json({
      message: 'User deleted correctly!'
    });
  } catch (error) {
    return res.json({
      message: error.message
    });
  }
};