const MIMGB = './assets/zhy2.png';
const MIMGA = './assets/zhy1.png';

class ScoreCount {
    public constructor(id: string, tipsId: string) {
        this.element = document.getElementById(id) as HTMLSpanElement;
        this.tipsElement = document.getElementById(tipsId) as HTMLSpanElement;
    }
    private _score = 0;
    public set score(val: number) {
        this._score = val;
        this.element!.innerText = `得分: ${this.score} miss: ${this.miss}`;
    }

    public get score() {
        return this._score;
    }

    public get miss() {
        return this._miss;
    }

    public set miss(val: number) {
        this._miss = val;
        this.element!.innerText = `得分: ${this.score} miss: ${this.miss}`;
    }
    private element?: HTMLSpanElement;
    private tipsElement?: HTMLSpanElement;
    private hitContinCount = 0;
    private _miss = 0;

    public set continuous(val: boolean) {
        this._continuous = val;
        if (val) {
            this.hitContinCount++;
            this.tipsElement!.innerText = `连击${this.hitContinCount}次`;
        }
        else {
            if (this.hitContinCount > 0) {
                this.miss++;
                this.tipsElement!.innerText = `连击失败`;
                this.hitContinCount = 0;
            }
            else {
                this.tipsElement!.innerText = '连击可获得更多得分';
            }
        }
    }

    public get continuous() {
        return this._continuous;
    }

    private _continuous = false;

    public addScore(scores: number) {
        if (this.continuous) {
            this.score += scores + 1;
        }
        else {
            this.score += scores;
        }
    }

    public clear() {
        this._miss = 0;
        this._score = 0;
        this.hitContinCount = 0;
        this._continuous = false;
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
                this.isUp = false;
                this.audioPlayer!.currentTime = 0;
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
                this.scoreCount!.continuous = false;
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
    const scoreCount = new ScoreCount('score', 'tips');
    const stBtn = document.getElementById('btn') as HTMLButtonElement;
    const limited = 20;
    let times = 0;
    let last = -1;
    stBtn.onclick = () => {
        stBtn.style.display = 'none';
        bgmPlayer.play();
        for (let i = 1; i <= 6; i++) {
            units.push(new HoleUnit(`hole${i}`, player));
        }
        units.forEach(e => e.init(scoreCount));
        let random = new Random();
        let handle = setInterval(() => {
            if (times >= limited) {
                clearInterval(handle);
                setTimeout(() => {
                    alert(`得分: ${scoreCount.score} miss: ${scoreCount.miss}`);
                    stBtn.style.display = 'block';
                    times = 0;
                    scoreCount.clear();
                }, 2500);

            }
            times++;
            let next = random.Next(0, 5);
            if (next == last) {
                setTimeout(() => units[next].start(), 800);
            }
            else {
                units[next].start();
            }
            last = next;
        }, 1000);
    };

    //units[0].start();
}; 