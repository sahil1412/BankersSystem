var deposit = function (val) {
    return `val ${val} deposit successfully!! `;
}
function withdraw(val, bal) {
    if (val > bal) {
        return `no sufficient funds`;
    } else {
        return `withdraw ${val} successfully!! `;
    }
}
module.exports = deposit;
module.exports = withdraw;