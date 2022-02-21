"use strict";
const MIMGB = './assets/zhy2.png';
const MIMGA = './assets/zhy1.png';
class ScoreCount {
    constructor(id) {
        this._score = 0;
        this.continuous = false;
        this.element = document.getElementById(id);
    }
    set score(val) {
        this._score = val;
        this.element.innerText = `得分: ${this.score}`;
    }
    get score() {
        return this._score;
    }
    addScore(scores) {
        if (this.continuous) {
            this.score += scores + 1;
        }
        else {
            this.score += scores;
        }
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
        this.hitCount = 0;
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
                this.hitCount++;
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
    const scoreCount = new ScoreCount('score');
    const stBtn = document.getElementById('btn');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3RzL21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE1BQU0sS0FBSyxHQUFHLG1CQUFtQixDQUFDO0FBQ2xDLE1BQU0sS0FBSyxHQUFHLG1CQUFtQixDQUFDO0FBRWxDLE1BQU0sVUFBVTtJQUNaLFlBQW1CLEVBQVU7UUFHckIsV0FBTSxHQUFHLENBQUMsQ0FBQztRQVVaLGVBQVUsR0FBRyxLQUFLLENBQUM7UUFadEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBb0IsQ0FBQztJQUNsRSxDQUFDO0lBRUQsSUFBVyxLQUFLLENBQUMsR0FBVztRQUN4QixJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUNsQixJQUFJLENBQUMsT0FBUSxDQUFDLFNBQVMsR0FBRyxPQUFPLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNsRCxDQUFDO0lBRUQsSUFBVyxLQUFLO1FBQ1osT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFJTSxRQUFRLENBQUMsTUFBYztRQUMxQixJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDakIsSUFBSSxDQUFDLEtBQUssSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO1NBQzVCO2FBQ0k7WUFDRCxJQUFJLENBQUMsS0FBSyxJQUFJLE1BQU0sQ0FBQztTQUN4QjtJQUNMLENBQUM7Q0FFSjtBQUVELE1BQU0sTUFBTTtJQUNSO0lBQ0EsQ0FBQztJQUVNLElBQUksQ0FBQyxNQUFjLENBQUMsRUFBRSxNQUFjLENBQUM7UUFDeEMsSUFBSSxLQUFLLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUN0QixJQUFJLFFBQVEsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFDdkQsT0FBTyxRQUFRLENBQUM7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