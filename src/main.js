import init from "./init";
import "./style.css";

const data = init();

if (!data) throw new Error("specify all search params");
