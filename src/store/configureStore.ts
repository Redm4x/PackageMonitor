import configureStoreDev from "./configureStore.dev";
import configureStoreProd from "./configureStore.prod";

export default function configureStore() {
  if (process.env.NODE_ENV === "production") {
    return configureStoreProd();
  } else {
    return configureStoreDev();
  }
}