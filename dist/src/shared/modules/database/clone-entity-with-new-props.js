"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneEntityWithNewProps = cloneEntityWithNewProps;
function cloneEntityWithNewProps(entity, attributes) {
    return Object.assign(new entity.constructor(), entity, Object.fromEntries(Object.entries(attributes).filter(([_, value]) => value !== undefined)));
}
//# sourceMappingURL=clone-entity-with-new-props.js.map