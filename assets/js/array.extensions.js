Array.prototype.flat = function () {
    return this.reduce((acc, cur) => {
        acc.push(...cur);
        return acc;
    }, []);
};
