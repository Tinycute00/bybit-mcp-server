"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreetingService = void 0;
/**
 * A simple service for generating greetings
 */
var GreetingService = /** @class */ (function () {
    function GreetingService() {
    }
    /**
     * Generate a greeting message
     * @param name The name to greet
     * @returns A greeting message
     */
    GreetingService.generateGreeting = function (name) {
        return "Hello, ".concat(name, "! Welcome to the MCP Server.");
    };
    /**
     * Generate a farewell message
     * @param name The name to bid farewell to
     * @returns A farewell message
     */
    GreetingService.generateFarewell = function (name) {
        return "Goodbye, ".concat(name, "! Thank you for using the MCP Server.");
    };
    return GreetingService;
}());
exports.GreetingService = GreetingService;
