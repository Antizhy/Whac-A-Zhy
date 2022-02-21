const MIMGB = './assets/zhy2.png';
const MIMGA = './assets/zhy1.png';

class ScoreCount {
    public constructor(id: string) {
        this.element = document.getElementById(id) as HTMLSpanElement;
    }
    private _score = 0;
    public set score(val: number) {
        this._score = val;
        this.element!.innerText = `得分: ${this.score}`;
    }

    public get score() {
        return this._score;
    }
    private element?: HTMLSpanElement;
    public continuous = false;

    public addScore(scores: number) {
        if (this.continuous) {
            this.score += scores + 1;
        }
        else {
            this.score += scores;
        }
    }

}

class Random {
    public constructor() {
    }

    public Next(min: number = 0, max: number = 1): number {
        let range = max - min;
        let ranValue = min + Math.round(Math.random() * range);
        return ranValue;
    }
}

class HoleUnit {
    public constructor(id: string, player: HTMLAudioElement) {
        this.htmlElementId = id;
        this.audioPlayer = player;
    }

    // ms
    private risingDuration = 500;
    private decliningDuration = 500;
    private waitDuration = 3000;
    private imgBox?: HTMLImageElement;

    private htmlElementId: string;
    private element?: HTMLDivElement;
    private handle = 0;
    private isUp = false;
    private hitCount = 0;
    private scoreCount?: ScoreCount;
    private audioPlayer?: HTMLAudioElement;

    public init(scoreCount: ScoreCount) {
        this.element = document.getElementById(this.htmlElementId) as HTMLDivElement;
        this.imgBox = document.createElement('img');
        this.imgBox.src = MIMGB;
        this.imgBox.className = 'mimg';
        this.element.append(this.imgBox);
        let div2 = document.createElement('div');
        div2.className = 'img-black-bg';
        this.element.append(div2);
        this.setScoreCount(scoreCount);
        this.element.onclick = () => {
            if (this.isUp) {
                this.hitCount++;
                this.audioPlayer!.play();
                this.imgBox!.src = MIMGA;
                this.scoreCount!.addScore(1);
                this.scoreCount!.continuous = true;
                this.cancelWait();
                setTimeout(() => {
                    this.decline();
                }, 300);
                
                // this.imgBox!.src = MIMGB;
                // this.start();
            }
            else {
                //this.imgBox!.src = MIMGA;
                //this.hitCount++;
                this.scoreCount!.continuous = false;
                
            }
        };
    }

    public rise() {
        this.imgBox!.src = MIMGB;
        this.imgBox!.style.transform = 'translateY(-30px)';
        this.imgBox!.style.webkitMaskPosition = 'center 80px';
        this.isUp = true;
    }

    public decline() {
        this.imgBox!.style.transform = 'translateY(30px)';
        this.imgBox!.style.webkitMaskPosition = 'center 0px';
        this.isUp = false;
    }

    public start() {
        if (this.isUp) {
            return;
        }
        setTimeout(() => {
            this.rise();
            // this.isUp = true;
            this.handle = setTimeout(() => {
                this.decline();
            }, this.waitDuration);
        }, 0);
    }

    public cancelWait() {
        clearTimeout(this.handle);
    }

    public setScoreCount(count: ScoreCount) {
        this.scoreCount = count;
    }


}


window.onload = () => {
    const units: HoleUnit[] = [];
    const player = document.getElementById('sfx') as HTMLAudioElement;
    const bgmPlayer = document.getElementById('bg') as HTMLAudioElement;
    const scoreCount = new ScoreCount('score');
    const stBtn = document.getElementById('btn') as HTMLButtonElement;
    stBtn.onclick = () => {
        stBtn.style.display = 'none';
        bgmPlayer.play();
        for (let i = 1; i <= 6; i++) {
            units.push(new HoleUnit(`hole${i}`, player));
        }
        units.forEach(e => e.init(scoreCount));
        let random = new Random();
        let handle = setInterval(() => {
            let next = random.Next(0, 5);
            units[next].start();
        }, 1500);
    };
    
    //units[0].start();
}; 