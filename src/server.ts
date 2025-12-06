import app from "./app";
import config from "./config";

const port = config.PORT || 5000;

app.listen(port, () => {
  console.log(`Vehicle Rental System app listening on port ${port}`);
});
