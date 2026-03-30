module.exports = {
  transform: {
    "^.+\\.js$": "babel-jest"
  },
  testEnvironment: "node"            // отключаем Babel/TS, используем нативный ESM
};