"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Logger {
    static instance;
    editablePrint = null;
    constructor() {
    }
    static get log() {
        if (!Logger.instance)
            Logger.instance = new Logger();
        return Logger.instance;
    }
    getPrints(title, titleStyle, messageAltStyle, format, ...message) {
        const maxL = process.stdout.columns - 26 - (format ? 2 : 5);
        let currentLineLength = 0;
        let maxLenReached = false;
        return message.map((content, index) => {
            if (typeof content !== 'string')
                content = content.toString();
            const alt = index % 2 === 1;
            let additionalContent = '';
            if (alt)
                additionalContent = messageAltStyle;
            if (index === 0)
                additionalContent = this.getHeader(title, titleStyle);
            if (currentLineLength + content.length >= maxL) {
                return additionalContent + content.split(' ').map((word) => {
                    if (currentLineLength + word.length + 1 >= maxL) {
                        if (format) {
                            currentLineLength = 0;
                            return '\n' + Logger.styles.reset + this.getHeader('>', titleStyle) + (alt ? messageAltStyle : '') + word + ' ';
                        }
                        else {
                            if (!maxLenReached) {
                                maxLenReached = true;
                                return '...';
                            }
                            else
                                return null;
                        }
                    }
                    else {
                        currentLineLength += word.length + 1;
                        return word + ' ';
                    }
                }).join('') + Logger.styles.reset + Logger.styles.fg.white;
            }
            else {
                currentLineLength += content.length;
                return additionalContent + content + (alt ? Logger.styles.reset + Logger.styles.fg.white : '');
            }
        }).join('') + Logger.styles.reset + Logger.styles.fg.white;
    }
    editPrint(title, titleStyle, messageAltStyle, ...content) {
        process.stdout.clearLine(-1);
        process.stdout.cursorTo(0);
        this.editablePrint = this.getPrints(title, titleStyle, messageAltStyle, false, ...content);
        process.stdout.clearLine(-1);
        process.stdout.write(this.editablePrint);
    }
    print(title, titleStyle, messageAltStyle, format, ...content) {
        if (!this.editablePrint)
            process.stdout.write(this.getPrints(title, titleStyle, messageAltStyle, format, ...content) + '\n');
        else {
            process.stdout.clearLine(-1);
            process.stdout.cursorTo(0);
            process.stdout.write(this.getPrints(title, titleStyle, messageAltStyle, format, ...content) + '\n' + this.editablePrint);
        }
    }
    releasePrint() {
        if (!this.editablePrint)
            return;
        this.editablePrint = null;
        process.stdout.clearLine(-1);
        process.stdout.cursorTo(0);
    }
    separator() {
        this.print('—'.repeat(12), Logger.styles.fg.white, Logger.styles.fg.white, true, '—'.repeat(Math.round(process.stdout.columns * 0.8) - 30));
    }
    info(title, ...content) {
        this.print(title, Logger.styles.fg.blue, Logger.styles.fg.blue, true, ...content);
    }
    error(title, ...content) {
        this.print(title, Logger.styles.bg.red + Logger.styles.fg.white, Logger.styles.fg.red, true, ...content);
    }
    warn(title, ...content) {
        this.print(title, Logger.styles.fg.yellow, Logger.styles.fg.red, true, ...content);
    }
    success(title, ...content) {
        this.print(title, Logger.styles.fg.green, Logger.styles.fg.green, true, ...content);
    }
    debug(title, ...content) {
        this.print(title, Logger.styles.fg.magenta, Logger.styles.fg.magenta, true, ...content);
    }
    getHeader(title, titleStyle) {
        const date = new Date();
        const dateElements = [date.getHours(), date.getMinutes(), date.getSeconds()];
        return `${Logger.styles.fg.black + Logger.styles.bg.white}[${dateElements.map((element) => element < 10 ? `0${element}` : element).join(':')}]${Logger.styles.reset} ${titleStyle}${title.padStart(12)}${Logger.styles.reset} | ${Logger.styles.fg.white}`;
    }
    static styles = {
        reset: '\x1b[0m',
        bright: '\x1b[1m',
        dim: '\x1b[2m',
        underscore: '\x1b[4m',
        blink: '\x1b[5m',
        reverse: '\x1b[7m',
        hidden: '\x1b[8m',
        default: '\x1b[0m\x1b[37m',
        fg: {
            black: '\x1b[30m',
            red: '\x1b[31m',
            green: '\x1b[32m',
            yellow: '\x1b[33m',
            blue: '\x1b[34m',
            magenta: '\x1b[35m',
            cyan: '\x1b[36m',
            white: '\x1b[37m',
            crimson: '\x1b[38m'
        },
        bg: {
            black: '\x1b[40m',
            red: '\x1b[41m',
            green: '\x1b[42m',
            yellow: '\x1b[43m',
            blue: '\x1b[44m',
            magenta: '\x1b[45m',
            cyan: '\x1b[46m',
            white: '\x1b[47m',
            crimson: '\x1b[48m'
        }
    };
}
exports.default = Logger;
