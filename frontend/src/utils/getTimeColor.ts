export const getTimeColor = (count: number) => {
    if (count > 5) return 'success';
    if (count <= 5 && count > 1) return 'warning';
    return 'error';
};
