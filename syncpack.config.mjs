/** @type {import("syncpack").RcFile} */
export default {
  versionGroups: [
    {
      label: "Local workspace packages",
      dependencies: ["@mikeour/**"],
      isIgnored: true,
    },
  ],
};
