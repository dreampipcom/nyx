// chat.d.ts
export interface IChatConnection {
  room: string;
  username: string;
  id: string;
}

export interface IChatMessage extends IChatConnection {
	 text: string;
}

export interface IChatOperation {
	error: string;
	ans: IChatConnection[];
}