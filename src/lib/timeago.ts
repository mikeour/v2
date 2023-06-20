import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";

TimeAgo.setDefaultLocale(en.locale);
TimeAgo.addLocale(en);

const timeAgo = new TimeAgo("en-US");

export default timeAgo;
