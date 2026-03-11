const fs = require('fs');
try {
    const logUtf16 = fs.readFileSync('dev_error.log', 'utf16le');
    console.log('UTF-16LE:', logUtf16.substring(Math.max(0, logUtf16.length - 2000)));
} catch (e) {
    try {
        const logUtf8 = fs.readFileSync('dev_error.log', 'utf8');
        console.log('UTF-8:', logUtf8.substring(Math.max(0, logUtf8.length - 2000)));
    } catch (err) {
        console.error(err);
    }
}
