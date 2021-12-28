module.exports = {
  "*": (filenames) =>
    filenames.map((filename) => `yarn nx format:write --files=${filename}`),
};
