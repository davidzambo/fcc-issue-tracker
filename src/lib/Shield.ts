interface iShield {
    charsToWatchFor: any;
}

export class Shield implements iShield {
    charsToWatchFor: any = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    public sanitizer(str: string) {
        const self = this;
        return str.replace(/[&<>"']/g, function(char: string){
            return self.charsToWatchFor[char];
        })
    }

    public sanitizeInput(body: any) {
        for (let i in body) {
            body[i] = this.sanitizer(body[i]);
        }
        return body;
    }
}