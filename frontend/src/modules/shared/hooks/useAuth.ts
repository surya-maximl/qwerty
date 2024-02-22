import { useSelector } from "react-redux";
import { selectAuth } from "../../authentication/reducers";

export const useAuth = () => useSelector(selectAuth)