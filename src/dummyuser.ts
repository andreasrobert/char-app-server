type id = string
type username = string
type room = string

const c_users = [] as any;

// joins the user to the specific chatroom
export function join_User(id:id, username:username, room:room) {
  const p_user = { id, username, room };

  c_users.push(p_user);
  console.log(c_users, "users");

  return p_user;
}

console.log("user out", c_users);

// Gets a particular user id to return the current user
export function get_Current_User(id:id) {
  return c_users.find((p_user:any) => p_user.id === id);
}

// called when the user leaves the chat and its user object deleted from array
export function user_Disconnect(id:id) {
  const index = c_users.findIndex((p_user:any) => p_user.id === id);

  if (index !== -1) {
    return c_users.splice(index, 1)[0];
  }
}

