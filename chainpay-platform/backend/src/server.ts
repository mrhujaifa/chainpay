import app from "./app";

const main = () => {
  try {
    app.listen(5000, () => {
      console.log("Circle Core Server is runing");
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

main();
