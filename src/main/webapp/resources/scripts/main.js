// Класс Graph будет доступен глобально через window после загрузки graph.js
let graphDrawer;

// Инициализация графика после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем что Graph загружен
    if (typeof Graph === 'undefined') {
        return;
    }

    // Создаём экземпляр графика
    graphDrawer = new Graph('graph-svg');

    // Рисуем график с R=1 по умолчанию
    const r = getSelectedR() || 1;
    graphDrawer.draw(r);

    // Отрисовываем существующие точки
    redrawAllPoints();

    // Обновляем значение слайдера
    updateYValue();
});

// Получить выбранное значение R
function getSelectedR() {
    const rSelect = document.getElementById('form:r');
    return rSelect && rSelect.value ? parseFloat(rSelect.value) : null;
}

// Обновление графика при изменении R
function updateGraph() {
    if (!graphDrawer) return;

    const r = getSelectedR();
    if (!r) return;

    graphDrawer.draw(r);
    redrawAllPoints();
}

// Перерисовка всех точек на графике
function redrawAllPoints() {
    if (!graphDrawer) return;

    const r = getSelectedR();
    if (!r) return;

    graphDrawer.draw(r);

    // Точки берутся из DOM таблицы
    const rows = document.querySelectorAll('#form\\:resultsTable tbody tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 4) {
            const xText = cells[0].textContent.trim();
            const yText = cells[1].textContent.trim();
            const hitText = cells[3].textContent.trim();

            // Проверяем что данные не пустые
            if (!xText || !yText) return;

            const x = parseFloat(xText);
            const y = parseFloat(yText);

            // Проверяем что парсинг прошёл успешно
            if (isNaN(x) || isNaN(y)) {
                return;
            }

            const hit = hitText === 'Да';
            graphDrawer.addPoint(x, y, hit);
        }
    });
}

// Обработка клика по графику
function handleGraphClick(event) {
    const r = getSelectedR();
    if (!r) {
        alert('Сначала выберите значение R');
        return;
    }

    if (!graphDrawer) return;

    const coords = graphDrawer.getClickCoords(event);

    // Подставляем координаты в скрытые поля
    const graphXField = document.getElementById('form:graphX');
    const graphYField = document.getElementById('form:graphY');

    if (!graphXField || !graphYField) {
        return;
    }

    graphXField.value = coords.x;
    graphYField.value = coords.y;
    document.getElementById('form:submitGraph').click();
    
}

// Обновление отображения значения слайдера
function updateYValue() {
    const yInput = document.getElementById('form:yInput');
    const yValue = document.getElementById('form:yValue');
    if (yInput && yValue) {
        yValue.textContent = parseFloat(yInput.value).toFixed(1);
    }
}

// Обработчик события AJAX для f:ajax
function handleAjaxComplete(data) {
    if (data.status === 'success') {
        redrawAllPoints();
    }
}

// Экспортируем функции для использования в XHTML
window.updateGraph = updateGraph;
window.handleGraphClick = handleGraphClick;
window.updateYValue = updateYValue;
window.redrawAllPoints = redrawAllPoints;
window.handleAjaxComplete = handleAjaxComplete;
