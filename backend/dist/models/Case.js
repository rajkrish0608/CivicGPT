"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Case = exports.CaseStatus = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Scheme_1 = require("./Scheme");
var CaseStatus;
(function (CaseStatus) {
    CaseStatus["PENDING"] = "pending";
    CaseStatus["IN_PROGRESS"] = "in_progress";
    CaseStatus["APPROVED"] = "approved";
    CaseStatus["REJECTED"] = "rejected";
})(CaseStatus || (exports.CaseStatus = CaseStatus = {}));
let Case = class Case {
};
exports.Case = Case;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Case.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Case.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", User_1.User)
], Case.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Case.prototype, "schemeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Scheme_1.Scheme),
    (0, typeorm_1.JoinColumn)({ name: 'schemeId' }),
    __metadata("design:type", Scheme_1.Scheme)
], Case.prototype, "scheme", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CaseStatus,
        default: CaseStatus.PENDING,
    }),
    __metadata("design:type", String)
], Case.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb'),
    __metadata("design:type", Object)
], Case.prototype, "formData", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Case.prototype, "pdfUrl", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Case.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Case.prototype, "updatedAt", void 0);
exports.Case = Case = __decorate([
    (0, typeorm_1.Entity)()
], Case);
