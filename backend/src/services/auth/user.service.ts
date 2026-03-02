import jwtService from './jwt.service';
import User, { userSchema } from '../../models/authModels/user.model';

export const createUser = async (user: userSchema) => {
  const isExisting = await User.findOne({ email: user.email });
  if (!isExisting) {
    const newUser = await User.create(user);
    newUser.save();
    return newUser;
  }
  const token = await jwtService.findandreissueToken(isExisting.email);
  isExisting.access_token = token;
  return isExisting;
};

type FindUserCriteria = {
  id?: string;
  email?: string;
};

export const findUser = async ({ id, email }: FindUserCriteria) => {
  let user = null;
  if (email) {
    user = await User.findOne({ email }).select('+password');
  } else if (id) {
    user = await User.findById(id);
  }
  return user;
};

const userService = {
  createUser,
  findUser,
};

export default userService;
