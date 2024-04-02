export default class Logger {

    /**
     * Singleton instance
     */
    private static instance: Logger;

    /**
     * Current editable print, if any
     */
    private editablePrint: string | null = null;

    private constructor() {
        // ...
    }

    /**
     * Get logger instance
     */
    public static get log(): Logger {

        if (!Logger.instance) Logger.instance = new Logger();
        return Logger.instance;

    }

    /**
     * Get parsed print (header + message w/ styles)
     * @param title Title of the log
     * @param titleStyle Style of the title
     * @param messageAltStyle Style applied to messages with index % 2 !== 0
     * @param format Format the message to fit the terminal, if set to *false*, add ellipsis if terminal width is exceeded
     * @param message Message to print (spreaded array of strings)
     * @example log('Example', styles.fg.blue, styles.fg.green, true, 'Hello ', 'World', '!');
     * @returns
     */
    private getPrints(title: string, titleStyle: string, messageAltStyle: string, format: boolean, ...message: any[]): string {

        const maxL = process.stdout.columns - 26 - (format ? 2 : 5); /* 26 = header length - 5 for margin */
        let currentLineLength = 0;
        let maxLenReached = false;

        return message.map((content, index) => {

            // If content is not a string, convert it to string
            if (typeof content !== 'string') content = content.toString();

            // Is alt?
            const alt = index % 2 === 1;

            let additionalContent = '';
            if (alt) additionalContent = messageAltStyle;
            if (index === 0) additionalContent = this.getHeader(title, titleStyle);

            // If length of content is greater than maxL, split it
            if (currentLineLength + content.length >= maxL) {

                // Go through each word, and add a new line when the maxL is reached
                return additionalContent + content.split(' ').map((word: string) => {

                    // MaxL reached, add a new line
                    if (currentLineLength + word.length + 1 >= maxL) {

                        if (format) {

                            currentLineLength = 0;
                            return '\n' + Logger.styles.reset + this.getHeader('>', titleStyle) + (alt ? messageAltStyle : '') + word + ' ';

                        } else {

                            if (!maxLenReached) {

                                maxLenReached = true;
                                return '...';

                            } else return null;

                        }

                    } else {

                        // Keep counting
                        currentLineLength += word.length + 1;
                        return word + ' ';

                    }

                }).join('') + Logger.styles.reset + Logger.styles.fg.white;

            } else {

                // Keep counting
                currentLineLength += content.length;
                return additionalContent + content + (alt ? Logger.styles.reset + Logger.styles.fg.white : '');

            }

        }).join('') + Logger.styles.reset + Logger.styles.fg.white;

    }

    /**
     * Updates the current print, or creates a new one if there is none
     * This print will stick to the bottom of the terminal, until it is released with releasePrint()
     * @warning message length should not exceed the terminal width (ellipsis will be added if it does)
     * @param title Title of the log
     * @param titleStyle Style of the title
     * @param messageAltStyle Style applied to messages with index % 2 !== 0
     * @param message Message to print (spreaded array of strings)
     * @example log('Example', styles.fg.blue, styles.fg.green, 'Hello ', 'World', '!');
     */
    public editPrint(title: string, titleStyle: string, messageAltStyle: string, ...content: any[]): void {

        // TODO: Handle multiple lines/formatting for editPrint messages
        // Could not get it to work properly, so I'll leave it like this for now
        // Would be nice to have multiple lines editables prints in the future
        process.stdout.clearLine(-1);
        process.stdout.cursorTo(0);
        this.editablePrint = this.getPrints(title, titleStyle, messageAltStyle, false, ...content);
        process.stdout.clearLine(-1);
        process.stdout.write(this.editablePrint);

    }

    public print(title: string, titleStyle: string, messageAltStyle: string, format: boolean, ...content: any[]): void {

        if (!this.editablePrint)
            process.stdout.write(this.getPrints(title, titleStyle, messageAltStyle, format, ...content) + '\n');

        else {

            process.stdout.clearLine(-1);
            process.stdout.cursorTo(0);
            process.stdout.write(this.getPrints(title, titleStyle, messageAltStyle, format, ...content) + '\n' + this.editablePrint);

        }

    }

    /**
     * Release the current editable print
     */
    public releasePrint(): void {

        if (!this.editablePrint) return;
        this.editablePrint = null;
        process.stdout.clearLine(-1);
        process.stdout.cursorTo(0);

    }

    /**
     * Log separator
     */
    public separator(): void {

        this.print('—'.repeat(12), Logger.styles.fg.white, Logger.styles.fg.white, true, '—'.repeat(Math.round(process.stdout.columns * 0.8) - 30));

    }

    public info(title: string, ...content: any[]): void {

        this.print(title, Logger.styles.fg.blue, Logger.styles.fg.blue, true, ...content);

    }

    public error(title: string, ...content: any[]): void {

        this.print(title, Logger.styles.bg.red + Logger.styles.fg.white, Logger.styles.fg.red, true, ...content);

    }

    public warn(title: string, ...content: any[]): void {

        this.print(title, Logger.styles.fg.yellow, Logger.styles.fg.red, true, ...content);

    }

    public success(title: string, ...content: any[]): void {

        this.print(title, Logger.styles.fg.green, Logger.styles.fg.green, true, ...content);

    }

    public debug(title: string, ...content: any[]): void {

        this.print(title, Logger.styles.fg.magenta, Logger.styles.fg.magenta, true, ...content);

    }

    /**
     * Get header of the log
     * @param title Title of the log
     * @param titleStyle Style of the title
     */
    private getHeader(title: string, titleStyle: string): string {

        const date = new Date();
        const dateElements = [date.getHours(), date.getMinutes(), date.getSeconds()];

        return `${Logger.styles.fg.black + Logger.styles.bg.white}[${dateElements.map((element) => element < 10 ? `0${element}` : element).join(':')}]${Logger.styles.reset} ${titleStyle}${title.padStart(12)}${Logger.styles.reset} | ${Logger.styles.fg.white}`;

    }

    public static styles = {
        // General text styles
        reset: '\x1b[0m',
        bright: '\x1b[1m',
        dim: '\x1b[2m',
        underscore: '\x1b[4m',
        blink: '\x1b[5m',
        reverse: '\x1b[7m',
        hidden: '\x1b[8m',
        default: '\x1b[0m\x1b[37m',

        // Foreground text colors
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

        // Background text colors
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