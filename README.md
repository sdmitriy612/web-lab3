# Лабораторная работа 3 - JSF приложение

## Структура проекта (JSF)

### Backend (Java)
```
src/main/java/ru/sdmitriy612/
├── FormBean.java              # Управляемый бин (SessionScoped)
│   ├── Валидация входных данных
│   ├── Проверка попадания в область
│   ├── Обработка формы (checkPoint)
│   ├── Обработка клика по графику (checkPointFromGraph)
│   └── Управление результатами
└── models/
    └── CheckResult.java       # Модель результата проверки
```

### Frontend (XHTML + JSF)
```
src/main/webapp/
├── index.xhtml                # Основная страница (JSF + PrimeFaces)
├── start.xhtml                # Стартовая страница
├── resources/
│   ├── css/
│   │   └── style.css         # Стили для JSF-компонентов
│   └── scripts/
│       └── graph.js          # Модуль работы с графиком
└── WEB-INF/
    ├── web.xml               # Конфигурация JSF
    ├── faces-config.xml      # Навигация JSF
    └── beans.xml             # CDI конфигурация
```

## Реализованная функциональность

### 1. FormBean (JSF Managed Bean)
- **Scope**: @SessionScoped - сохраняет данные между запросами
- **Валидация**: 
  - X: [-3; 5] (InputText)
  - Y: [-2; 2] (PrimeFaces Slider с шагом 0.5)
  - R: [1; 3] (SelectOneMenu: 1, 1.5, 2, 2.5, 3)
- **Методы**:
  - `checkPoint()` - обработка формы
  - `checkPointFromGraph()` - обработка клика по графику через JSF RemoteCommand
  - `clearForm()` - очистка полей формы
  - `clearResults()` - очистка таблицы результатов

### 2. График (обновлённые области)
- **1 четверть**: Прямоугольник (0 < x < R; 0 < y < R/2)
- **2 четверть**: Часть окружности (центр в 0;0, радиус R, x < 0, y > 0)
- **3 четверть**: Пусто
- **4 четверть**: Треугольник (гипотенуза через (0, -R) и (R, 0))

### 3. JSF компоненты
- **h:inputText** - ввод X с валидацией
- **p:slider** - слайдер для Y
- **h:selectOneMenu** - выбор R
- **p:commandButton** - кнопки с AJAX
- **h:dataTable** - таблица результатов
- **p:growl** - всплывающие сообщения
- **p:remoteCommand** - обработка клика по графику

### 4. JavaScript интеграция
- Модуль `graph.js` - отрисовка графика и областей
- Обработка кликов по SVG
- Вызов JSF RemoteCommand с координатами
- Автоматическая перерисовка точек после AJAX

## Запуск приложения

### 1. Сборка проекта
```bash
gradlew clean build
```

### 2. Развёртывание
Скопируйте `build/libs/app.war` на сервер приложений:
- WildFly 27+ (с Jakarta EE 10)
- GlassFish 7+
- Tomcat 10+ (с дополнительными библиотеками JSF)

### 3. Доступ к приложению
- Стартовая страница: `http://localhost:8080/app/start.xhtml`
- Основная страница: `http://localhost:8080/app/index.xhtml`

## Зависимости

```gradle
// JSF
implementation 'org.glassfish:jakarta.faces:4.0.0'

// PrimeFaces (для слайдера и других компонентов)
implementation 'org.primefaces:primefaces:13.0.0:jakarta'

// CDI (для @Named, @SessionScoped)
compileOnly 'jakarta.enterprise:jakarta.enterprise.cdi-api:4.0.0'
```

## Особенности реализации

### Клик по графику через JSF
```javascript
function handleGraphClick(event) {
    const coords = window.graphDrawer.getClickCoords(event);
    
    // Вызываем JSF RemoteCommand
    checkGraphPoint([
        {name: 'graphX', value: coords.x},
        {name: 'graphY', value: coords.y}
    ]);
}
```

В FormBean:
```java
public void checkPointFromGraph() {
    FacesContext context = FacesContext.getCurrentInstance();
    String xParam = context.getExternalContext()
        .getRequestParameterMap().get("graphX");
    String yParam = context.getExternalContext()
        .getRequestParameterMap().get("graphY");
    
    // Обработка и добавление результата
}
```

### Обновление графика после AJAX
```javascript
function redrawGraph() {
    const r = parseFloat(document.getElementById('form:r').value);
    window.graphDrawer.draw(r);
    
    // Добавляем все точки из результатов
    const results = #{formBean.results};
    results.forEach(result => {
        window.graphDrawer.addPoint(result.x, result.y, result.hit);
    });
}
```

## Автор
Санатин Дмитрий Павлович  
Группа: P3217  
Вариант: 3711

