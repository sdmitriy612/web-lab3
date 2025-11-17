let graphDrawer;

document.addEventListener('DOMContentLoaded', function() {
    if (typeof Graph === 'undefined') {
        return;
    }

    graphDrawer = new Graph('graph-svg');

    const r = getSelectedR() || 1;
    graphDrawer.draw(r);

    redrawAllPoints();

    updateYValue();
});

function getSelectedR() {
    const rSelect = document.getElementById('form:r');
    return rSelect && rSelect.value ? parseFloat(rSelect.value) : null;
}

function updateGraph() {
    if (!graphDrawer) return;

    const r = getSelectedR();
    if (!r) return;

    graphDrawer.draw(r);
    redrawAllPoints();
}

function redrawAllPoints() {
    if (!graphDrawer) return;

    const r = getSelectedR();
    if (!r) return;

    graphDrawer.draw(r);

    const rows = document.querySelectorAll('#form\\:resultsTable tbody tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 4) {
            const xText = cells[0].textContent.trim();
            const yText = cells[1].textContent.trim();
            const hitText = cells[3].textContent.trim();

            if (!xText || !yText) return;

            const x = parseFloat(xText);
            const y = parseFloat(yText);

            if (isNaN(x) || isNaN(y)) {
                return;
            }

            const hit = hitText === 'Да';
            graphDrawer.addPoint(x, y, hit);
        }
    });
}

function handleGraphClick(event) {
    const r = getSelectedR();
    if (!r) {
        alert('Сначала выберите значение R');
        return;
    }

    if (!graphDrawer) return;

    const coords = graphDrawer.getClickCoords(event);

    const graphXField = document.getElementById('form:graphX');
    const graphYField = document.getElementById('form:graphY');

    if (!graphXField || !graphYField) {
        return;
    }

    graphXField.value = coords.x;
    graphYField.value = coords.y;
    document.getElementById('form:submitGraph').click();
    
}

function updateYValue() {
    const yInput = document.getElementById('form:yInput');
    const yValue = document.getElementById('form:yValue');
    if (yInput && yValue) {
        const v = parseFloat(yInput.value);
        if (isNaN(v)) {
            yValue.textContent = '';
        } else {
            yValue.textContent = v.toFixed(1);
        }
    }
}

function handleAjaxComplete(data) {
    if (data.status === 'success') {
        redrawAllPoints();
    }
}
