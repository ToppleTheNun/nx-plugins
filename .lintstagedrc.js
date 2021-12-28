module.exports = {
  "*": (filenames) => `yarn nx format:write --files="${filenames.join(",")}"`,
};
