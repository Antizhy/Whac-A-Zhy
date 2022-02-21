"use strict";
const MIMGB = './assets/zhy2.png';
const MIMGA = './assets/zhy1.png';
class ScoreCount {
    constructor(id, tipsId) {
        this._score = 0;
        this.hitContinCount = 0;
        this._miss = 0;
        this._continuous = false;
        this.element = document.getElementById(id);
        this.tipsElement = document.getElementById(tipsId);
    }
    set score(val) {
        this._score = val;
        this.element.innerText = `得分: ${this.score} miss: ${this.miss}`;
    }
    get score() {
        return this._score;
    }
    get miss() {
        return this._miss;
    }
    set miss(val) {
        this._miss = val;
        this.element.innerText = `得分: ${this.score} miss: ${this.miss}`;
    }
    set continuous(val) {
        this._continuous = val;
        if (val) {
            this.hitContinCount++;
            this.tipsElement.innerText = `连击${this.hitContinCount}次`;
        }
        else {
            if (this.hitContinCount > 0) {
                this.miss++;
                this.tipsElement.innerText = `连击失败`;
                this.hitContinCount = 0;
            }
            else {
                this.tipsElement.innerText = '连击可获得更多得分';
            }
        }
    }
    get continuous() {
        return this._continuous;
    }
    addScore(scores) {
        if (this.continuous) {
            this.score += scores + 1;
        }
        else {
            this.score += scores;
        }
    }
    clear() {
        this._miss = 0;
        this._score = 0;
        this.hitContinCount = 0;
        this._continuous = false;
        this.element.innerText = `得分: ${this.score} miss: ${this.miss}`;
        this.tipsElement.innerText = '连击可获得更多得分';
    }
}
class Random {
    constructor() {
    }
    Next(min = 0, max = 1) {
        let range = max - min;
        let ranValue = min + Math.round(Math.random() * range);
        return ranValue;
    }
}
class HoleUnit {
    constructor(id, player) {
        // ms
        this.risingDuration = 500;
        this.decliningDuration = 500;
        this.waitDuration = 3000;
        this.handle = 0;
        this.isUp = false;
        this.htmlElementId = id;
        this.audioPlayer = player;
    }
    init(scoreCount) {
        this.element = document.getElementById(this.htmlElementId);
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
                this.audioPlayer.currentTime = 0;
                this.audioPlayer.play();
                this.imgBox.src = MIMGA;
                this.scoreCount.addScore(1);
                this.scoreCount.continuous = true;
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
                this.scoreCount.continuous = false;
            }
        };
    }
    rise() {
        this.imgBox.src = MIMGB;
        this.imgBox.style.transform = 'translateY(-30px)';
        this.imgBox.style.webkitMaskPosition = 'center 80px';
        this.isUp = true;
    }
    decline() {
        this.imgBox.style.transform = 'translateY(30px)';
        this.imgBox.style.webkitMaskPosition = 'center 0px';
        this.isUp = false;
    }
    start() {
        if (this.isUp) {
            return;
        }
        setTimeout(() => {
            this.rise();
            // this.isUp = true;
            this.handle = setTimeout(() => {
                this.scoreCount.continuous = false;
                this.decline();
            }, this.waitDuration);
        }, 0);
    }
    cancelWait() {
        clearTimeout(this.handle);
    }
    setScoreCount(count) {
        this.scoreCount = count;
    }
}
window.onload = () => {
    const units = [];
    const player = document.getElementById('sfx');
    const bgmPlayer = document.getElementById('bg');
    const scoreCount = new ScoreCount('score', 'tips');
    const stBtn = document.getElementById('btn');
    const limited = 20;
    let times = 0;
    let last = -1;
    stBtn.onclick = () => {
        stBtn.style.display = 'none';
        bgmPlayer.play();
        if (units.length == 0) {
            for (let i = 1; i <= 6; i++) {
                units.push(new HoleUnit(`hole${i}`, player));
            }
            units.forEach(e => e.init(scoreCount));
        }
        let random = new Random();
        let handle = setInterval(() => {
            if (times >= limited) {
                clearInterval(handle);
                setTimeout(() => {
                    alert(`得分: ${scoreCount.score} miss: ${scoreCount.miss}`);
                    stBtn.style.display = 'block';
                    times = 0;
                    scoreCount.clear();
                    last = -1;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3RzL21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE1BQU0sS0FBSyxHQUFHLG1CQUFtQixDQUFDO0FBQ2xDLE1BQU0sS0FBSyxHQUFHLG1CQUFtQixDQUFDO0FBRWxDLE1BQU0sVUFBVTtJQUNaLFlBQW1CLEVBQVUsRUFBRSxNQUFjO1FBSXJDLFdBQU0sR0FBRyxDQUFDLENBQUM7UUFvQlgsbUJBQWMsR0FBRyxDQUFDLENBQUM7UUFDbkIsVUFBSyxHQUFHLENBQUMsQ0FBQztRQXdCVixnQkFBVyxHQUFHLEtBQUssQ0FBQztRQWhEeEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBb0IsQ0FBQztRQUM5RCxJQUFJLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFvQixDQUFDO0lBQzFFLENBQUM7SUFFRCxJQUFXLEtBQUssQ0FBQyxHQUFXO1FBQ3hCLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ2xCLElBQUksQ0FBQyxPQUFRLENBQUMsU0FBUyxHQUFHLE9BQU8sSUFBSSxDQUFDLEtBQUssVUFBVSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDckUsQ0FBQztJQUVELElBQVcsS0FBSztRQUNaLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRUQsSUFBVyxJQUFJO1FBQ1gsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxJQUFXLElBQUksQ0FBQyxHQUFXO1FBQ3ZCLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO1FBQ2pCLElBQUksQ0FBQyxPQUFRLENBQUMsU0FBUyxHQUFHLE9BQU8sSUFBSSxDQUFDLEtBQUssVUFBVSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDckUsQ0FBQztJQU1ELElBQVcsVUFBVSxDQUFDLEdBQVk7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