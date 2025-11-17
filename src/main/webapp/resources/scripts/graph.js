class Graph {
    constructor(svgId) {
        this.svg = document.getElementById(svgId);
        this.baseScale = 120;
        this.currentScale = this.baseScale; // Инициализируем значением по умолчанию
    }

    draw(r) {
        this.svg.innerHTML = '';
        this.currentScale = Math.min(this.baseScale, 150 / r);

        this.drawBackground();
        this.drawAxes();
        this.drawAreas(r);
        this.drawLabels(r);
    }

    drawBackground() {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', '-200');
        rect.setAttribute('y', '-200');
        rect.setAttribute('width', '400');
        rect.setAttribute('height', '400');
        rect.setAttribute('fill', 'white');
        rect.setAttribute('stroke', 'black');
        this.svg.appendChild(rect);
    }

    drawAxes() {
        // Ось X
        const xLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        xLine.setAttribute('x1', '-180');
        xLine.setAttribute('y1', '0');
        xLine.setAttribute('x2', '180');
        xLine.setAttribute('y2', '0');
        xLine.setAttribute('stroke', 'black');
        xLine.setAttribute('stroke-width', '2');
        this.svg.appendChild(xLine);

        // Ось Y
        const yLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        yLine.setAttribute('x1', '0');
        yLine.setAttribute('y1', '-180');
        yLine.setAttribute('x2', '0');
        yLine.setAttribute('y2', '180');
        yLine.setAttribute('stroke', 'black');
        yLine.setAttribute('stroke-width', '2');
        this.svg.appendChild(yLine);

        // Стрелки
        const xArrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        xArrow.setAttribute('points', '180,0 170,-5 170,5');
        xArrow.setAttribute('fill', 'black');
        this.svg.appendChild(xArrow);

        const yArrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        yArrow.setAttribute('points', '0,-180 -5,-170 5,-170');
        yArrow.setAttribute('fill', 'black');
        this.svg.appendChild(yArrow);
    }

    // Рисуем области для заданного R (ОБНОВЛЕНО: выпуклая окружность)
    drawAreas(r) {
        const rPixels = r * this.currentScale;

        // 1 четверть: прямоугольник (0 <= x <= R; 0 <= y <= R/2)
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', '0');
        rect.setAttribute('y', -rPixels / 2);
        rect.setAttribute('width', rPixels);
        rect.setAttribute('height', rPixels / 2);
        rect.setAttribute('fill', 'lightblue');
        rect.setAttribute('opacity', '0.7');
        this.svg.appendChild(rect);

        // 2 четверть: ВЫПУКЛАЯ окружность (x*x + y*y <= R*R, x <= 0, y >= 0)
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        circle.setAttribute('d', `M 0,0 L ${-rPixels},0 A ${rPixels},${rPixels} 0 0,1 0,${-rPixels} Z`);
        circle.setAttribute('fill', 'lightblue');
        circle.setAttribute('opacity', '0.7');
        this.svg.appendChild(circle);

        // 4 четверть: треугольник (гипотенуза через (0, -R) и (R, 0))
        const triangle = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        triangle.setAttribute('points', `0,0 ${rPixels},0 0,${rPixels}`);
        triangle.setAttribute('fill', 'lightblue');
        triangle.setAttribute('opacity', '0.7');
        this.svg.appendChild(triangle);
    }

    // Рисуем подписи с R = значение
    drawLabels(r) {
        const rPixels = r * this.currentScale;

        // Подписи осей
        const xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        xLabel.setAttribute('x', '180');
        xLabel.setAttribute('y', '-5');
        xLabel.setAttribute('text-anchor', 'end');
        xLabel.textContent = 'X';
        this.svg.appendChild(xLabel);

        const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        yLabel.setAttribute('x', '5');
        yLabel.setAttribute('y', '-180');
        yLabel.textContent = 'Y';
        this.svg.appendChild(yLabel);

        // Метки с правильным масштабом
        const marks = [
            {x: -rPixels, y: -5, text: `-R`, anchor: 'middle'},
            {x: -rPixels/2, y: -5, text: `-R/2`, anchor: 'middle'},
            {x: rPixels/2, y: -5, text: `R/2`, anchor: 'middle'},
            {x: rPixels, y: -5, text: `R`, anchor: 'middle'},
            {x: 5, y: rPixels/2, text: `-R/2`, anchor: 'start'},
            {x: 5, y: rPixels, text: `-R`, anchor: 'start'},
            {x: 5, y: -rPixels/2, text: `R/2`, anchor: 'start'},
            {x: 5, y: -rPixels, text: `R`, anchor: 'start'}
        ];

        marks.forEach(mark => {
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', mark.x);
            text.setAttribute('y', mark.y);
            text.setAttribute('font-size', '12');
            text.setAttribute('text-anchor', mark.anchor || 'middle');
            text.textContent = mark.text;
            this.svg.appendChild(text);
        });
    }

    // Добавить точку
    addPoint(x, y, isHit) {
        // Проверка на корректность данных
        if (!this.currentScale || isNaN(x) || isNaN(y)) {
            console.error('Некорректные данные для точки:', x, y, this.currentScale);
            return;
        }

        const point = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        point.setAttribute('cx', x * this.currentScale);
        point.setAttribute('cy', -y * this.currentScale);
        point.setAttribute('r', '4');
        point.setAttribute('fill', isHit ? 'green' : 'red');
        point.setAttribute('stroke', 'black');
        point.classList.add('graph-point');
        this.svg.appendChild(point);
    }

    // Убрать все точки
    clearPoints() {
        const points = this.svg.querySelectorAll('.graph-point');
        points.forEach(p => p.remove());
    }

    // Получить координаты клика
    getClickCoords(event) {
        const rect = this.svg.getBoundingClientRect();
        const svgX = event.clientX - rect.left - rect.width / 2;
        const svgY = event.clientY - rect.top - rect.height / 2;

        return {
            x: Math.round((svgX / this.currentScale) * 100) / 100,
            y: Math.round((-svgY / this.currentScale) * 100) / 100
        };
    }
}

// Экспортируем класс глобально для использования в main.js
window.Graph = Graph;
