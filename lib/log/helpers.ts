// helpers.ts

export const createStatusStr = ({
  category,
  type,
  action,
  verb,
  status,
  message,
  context,
} = {}) => {
  const str = `((${category})): --- action / ${type} / ${action} / ${verb} / ${status}|${message} ---`;
  switch (context) {
    case "client": {
      return "%c " + str;
    }
    case "server": {
      const color = str.includes("error")
        ? "\x1b[1;41m "
        : !(str.includes("ready") || str.includes("done"))
          ? "\x1b[1;43m"
          : "\x1b[1;42m";
      const str_col = "\x1b[1;31m" + color + str + "\x1b[0m";
      return str_col;
    }
  }
};

export const dbLog = ({ type, action, verb, status, message }) => {
  const category = "database";
  console.log(
    createStatusStr({
      category,
      type,
      action,
      verb,
      status,
      message,
      context: "server",
    }),
  );
};

export const fluxLog = ({ type, action, verb, status, message }) => {
  const category = "react-flux";
  const str = createStatusStr({
    category,
    type,
    action,
    verb,
    status,
    message,
    context: "client",
  });
  return console.log(
    str,
    `background: ${str.includes("db") ? "#000055" : "#1f1f1f"}; color: ${str.includes("error") ? "error" : str.includes("idle") ? "yellow" : "green"};`,
  );
};

export const log = (str) =>
  console.log(
    str,
    `background: ${str.includes("db") ? "cyan" : "#1f1f1f"}; color: ${str.includes("error") ? "error" : str.includes("idle") ? "yellow" : "green"};`,
  );
