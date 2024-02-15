// users.ts
import type { IChatOperation, IChatConnection } from "@types"

interface IUserSet extends Set<string> {
  addUser?: (value: IChatConnection) => IChatOperation;
  removeUser?: (value: IChatConnection) => IChatOperation;
  findUser?: (value: IChatConnection) => IChatOperation;
  getRoom?: (value: IChatConnection) => IChatOperation;
}

const UserSet: IUserSet = new Set([]);
const User: IChatConnection[] = [] as IChatConnection[];

UserSet.addUser = ({ id, room, username }): IChatOperation => {
  const response = { error: undefined, ans: undefined };
  try {
    if (!UserSet.has(username)) {
      const userToAdd = {
        username,
        id,
        room,
      };
      UserSet.add(username);
      User.push(userToAdd);
      response.user = userToAdd;
    } else {
      response.error = 'User already in the list';
    }
  } catch (e) {
    throw new Error(`Generic: couldn't add ans: ${e}`);
  }
  return response;
};

UserSet.removeUser = ({ username }): IChatOperation => {
  try {
    const response = { error: undefined, ans: undefined };
    if (UserSet.has(username)) {
      const uIndex = User.findIndex((user) => {
        return user.username === username;
      });
      const userToDelete = User[uIndex];
      response.user = userToDelete;
      UserSet.remove(username);
      if (uIndex >= 0) User.splice(uIndex, 1);
    } else {
      response.error = 'User not in the chat';
    }
  } catch (e) {
    throw new Error(`Generic: couldn't delete ans: ${e}`);
  }
};

UserSet.findUser = ({ username }): IChatOperation => {
  const response = { error: undefined, ans: undefined };
  try {
    if (UserSet.has(username)) {
      const uIndex = User.findIndex((user) => {
        return user.username === username;
      });
      const foundUser = User[uIndex];

      response.user = foundUser;
    } else {
      response.error = 'User not found';
    }
  } catch (e) {
    throw new Error(`Generic: couldn't find ans: ${e}`);
  }

  return response;
};

UserSet.getRoom = ({ room }) => {
  const response = { error: undefined, ans: undefined };
  try {
    if (room) {
      const roomList = User.filter((user) => {
        return user.room === room;
      });
      response.ans = roomList;
    } else {
      response.error = 'No room specified';
    }
  } catch (e) {
    throw new Error(`Generic: couldn't find room list: ${e}`);
  }
  return response;
};

const addUser = ({ id, username, room }) => {
  try {
    if (!id) throw new Error('Socket error');
    if (!room) return { error: new Error('Room Name is required'), ans: undefined };
    if (!username) return { error: new Error('Username is required!'), ans: undefined };
    if (UserSet.has(username)) return { error: new Error('Username Already In Use'), ans: undefined };
    const opResult = UserSet.addUser({ id, room, username });
    return { error: opResult.error, ans: opResult.user };
  } catch (e) {
    if (!e) return { error: "exit 1: generic error: couldn't add user to the room", ans: undefined };
    else return { error: e, ans: undefined };
  }
};

const removeUser = ({ id, username }) => {
  try {
    if (!id) return { error: new Error('Socket error'), ans: undefined };
    if (!username) return { error: new Error('Need to specify an user to delete.'), ans: undefined };
    const opResult = UserSet.removeUser({ username });
    return { error: opResult.error, ans: opResult.user };
  } catch (e) {
    return { error: e, ans: undefined };
  }
};

const getUser = ({ username }) => {
  console.log('init get user');
  try {
    const opRes = UserSet.findUser({ username });
    return {
      ...opRes.user,
      error: opRes.error,
    };
  } catch (e) {
    return {
      error: `Generic error, couldn't search ans: ${e}`,
      ans: undefined,
    };
  }
};

const getUsersInRoom = ({ room }): IChatOperation => {
  try {
    const opRes = UserSet.getRoom({ room });
    return {
      ans: opRes.ans,
      error: opRes.error,
    };
  } catch (e) {
    return {
      error: `Generic error, couldn't search ans: ${e}`,
      ans: undefined,
    };
  }
};

export {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
