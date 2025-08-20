/**
 * Reference : https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Pausable.sol
 */

const Pausable = function () {

    const BasicOperationUtil = new BasicOperation();

    const PAUSE_STATE = "pause_state";

    const self = this;

    self.paused = function () {
        return BasicOperationUtil.loadObj(PAUSE_STATE);
    };

    self.requireNotPaused = function () {
        Utils.assert(self.paused() === false, "Pausable: Enforce paused");
    };

    self.requirePaused = function () {
        Utils.assert(self.paused() === true, "Pausable: Expected pause");
    };

    self.pause = function () {
        BasicOperationUtil.saveObj(PAUSE_STATE, true);
        Chain.tlog("Paused", Chain.msg.sender);
    };

    self.unpause = function () {
        BasicOperationUtil.saveObj(PAUSE_STATE, false);
        Chain.tlog("Unpaused", Chain.msg.sender);
    };

    self.whenNotPaused = function () {
        self.requireNotPaused();
    };

    self.whenPaused = function () {
        self.requirePaused();
    };
};