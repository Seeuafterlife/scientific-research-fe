import moment from "moment";

export const formatDateTime = (date: Date | undefined): string => {
    return moment(date).format("DD/MM/YYYY HH:mm:ss");
}
