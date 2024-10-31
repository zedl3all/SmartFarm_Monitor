// EasyPieChart
!function () { var a = function (a, b) { var c = document.createElement("canvas"); "undefined" != typeof G_vmlCanvasManager && G_vmlCanvasManager.initElement(c); var d = c.getContext("2d"); if (c.width = c.height = b.size, a.appendChild(c), window.devicePixelRatio > 1) { var e = window.devicePixelRatio; c.style.width = c.style.height = [b.size, "px"].join(""), c.width = c.height = b.size * e, d.scale(e, e) } d.translate(b.size / 2, b.size / 2), d.rotate((-0.5 + b.rotate / 180) * Math.PI); var f = (b.size - b.lineWidth) / 2; b.scaleColor && b.scaleLength && (f -= b.scaleLength + 2); var g = function (a, b, c) { c = Math.min(Math.max(0, c || 1), 1), d.beginPath(), d.arc(0, 0, f, 0, 2 * Math.PI * c, !1), d.strokeStyle = a, d.lineWidth = b, d.stroke() }, h = function () { var a, c, e = 24; d.lineWidth = 1, d.fillStyle = b.scaleColor, d.save(); for (var e = 24; e >= 0; --e)0 === e % 6 ? (c = b.scaleLength, a = 0) : (c = .6 * b.scaleLength, a = b.scaleLength - c), d.fillRect(-b.size / 2 + a, 0, c, 1), d.rotate(Math.PI / 12); d.restore() }; Date.now = Date.now || function () { return +new Date }; var i = function () { return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (a) { window.setTimeout(a, 1e3 / 60) } }(); this.clear = function () { d.clearRect(b.size / -2, b.size / -2, b.size, b.size) }, this.draw = function (a) { this.clear(), b.scaleColor && h(), b.trackColor && g(b.trackColor, b.lineWidth), d.lineCap = b.lineCap; var c; c = "function" == typeof b.barColor ? b.barColor(a) : b.barColor, a > 0 && g(c, b.lineWidth, a / 100) }.bind(this), this.animate = function (a, c) { var d = Date.now(); b.onStart(a, c); var e = function () { var f = Math.min(Date.now() - d, b.animate), g = b.easing(this, f, a, c - a, b.animate); this.draw(g), b.onStep(a, c, g), f >= b.animate ? b.onStop(a, c) : i(e) }.bind(this); i(e) }.bind(this) }, b = function (b, c) { var d, e = { barColor: "#ef1e25", trackColor: "#f9f9f9", scaleColor: "#dfe0e0", scaleLength: 5, lineCap: "round", lineWidth: 3, size: 110, rotate: 0, animate: 1e3, renderer: a, easing: function (a, b, c, d, e) { return (b /= e / 2) < 1 ? d / 2 * b * b + c : -d / 2 * (--b * (b - 2) - 1) + c }, onStart: function () { }, onStep: function () { }, onStop: function () { } }, f = {}, g = 0, h = function () { this.el = b, this.options = f; for (var a in e) e.hasOwnProperty(a) && (f[a] = c && "undefined" != typeof c[a] ? c[a] : e[a], "function" == typeof f[a] && (f[a] = f[a].bind(this))); f.easing = "string" == typeof f.easing && "undefined" != typeof jQuery && jQuery.isFunction(jQuery.easing[f.easing]) ? jQuery.easing[f.easing] : e.easing, d = new f.renderer(b, f), d.draw(g), b.dataset && b.dataset.percent && this.update(parseInt(b.dataset.percent, 10)) }.bind(this); this.update = function (a) { return a = parseInt(a, 10), f.animate ? d.animate(g, a) : d.draw(a), g = a, this }.bind(this), h() }; window.EasyPieChart = b }();

var options = {
    scaleColor: false,
    trackColor: '#1A1A19',
    barColor: '#F6FCDF',
    lineWidth: 6,
    lineCap: 'butt',
    size: 95
};

const charts = {};

window.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.chart').forEach(el => {
        const id = el.getAttribute('id');
        charts[id] = new EasyPieChart(el, options); // Store instance
    });

    // Line Chart Setup
    const moistureCtx = document.getElementById('moistureChart')?.getContext('2d');
    const tempCtx = document.getElementById('tempChart')?.getContext('2d');
    const mq8Ctx = document.getElementById('mq8Chart')?.getContext('2d');
    const mq135Ctx = document.getElementById('mq135Chart')?.getContext('2d');
    const lightCtx = document.getElementById('lightChart')?.getContext('2d');

    if (moistureCtx && tempCtx && mq8Ctx && mq135Ctx && lightCtx) {
        const moistureChart = new Chart(moistureCtx, createChartConfig('Moisture'));
        const tempChart = new Chart(tempCtx, createChartConfig('Temperature'));
        const mq8Chart = new Chart(mq8Ctx, createChartConfig('MQ8Level'));
        const mq135Chart = new Chart(mq135Ctx, createChartConfig('MQ135Level'));
        const lightChart = new Chart(lightCtx, createChartConfig('Light'));

        // MQTT Setup (Existing Code)
        const mqttClient = mqtt.connect('wss://test.mosquitto.org:8081/'); // Use wss:// instead of ws://
        const topic = 'it66070082/test';

        mqttClient.on('connect', function () {
            console.log('Connected to MQTT Broker');
            mqttClient.subscribe(topic, function (err) {
                if (err) console.error('Subscription error:', err);
                else console.log(`Subscribed to topic: ${topic}`);
            });
        });

        mqttClient.on('message', function (topic, message) {
            const msg = message.toString().split(':');
            if (msg.length === 2) {
                const key = msg[0].trim();
                const value = msg[1].trim();

                switch (key) {
                    case "Moisture":
                        updateChartElement('moi', value);
                        addData(moistureChart, 'Moisture', value); // Add data to line chart
                        break;
                    case "Temp":
                        document.getElementById('temp').textContent = `${value} °C`;
                        addData(tempChart, 'Temperature', value);
                        break;
                    case "MQ8Level":
                        updateChartElement('mq8', value);
                        addData(mq8Chart, 'Temperature', value);
                        break;
                    case "MQ135Level":
                        updateChartElement('mq135', value);
                        addData(mq135Chart, 'Temperature', value);
                        break;
                    case "lightLevel":
                        updateChartElement('light', value);
                        addData(lightChart, 'Light', value);
                        break;
                    default:
                        console.warn(`Unknown message key: ${key}`);
                }
            }
        });

        function updateChartElement(id, value) {
            const element = document.getElementById(id);
            if (element) {
                element.querySelector('span').textContent = value;
                element.setAttribute('data-percent', value);
                charts[id]?.update(parseInt(value, 10));
            }
        }

        function createChartConfig(label) {
            return {
                type: 'line',
                data: {
                    labels: [], // Time or labels will be added dynamically
                    datasets: [{
                        label: label,
                        data: [],
                        borderColor: '#F6FCDF',
                        tension: 0.4,
                        fill: false
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            title: { display: true, text: 'Time', color: '#F6FCDF' }, // Change x-axis title color
                            ticks: { color: '#F6FCDF' } // Change x-axis tick color
                        },
                        y: {
                            title: { display: true, text: 'Value', color: '#F6FCDF' }, // Change y-axis title color
                            ticks: { color: '#F6FCDF' } // Change y-axis tick color
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: '#F6FCDF' // Change legend text color
                            }
                        }
                    }
                }
            };
        }

        // Add Data to Line Chart
        function addData(chart, label, data) {
            const time = new Date().toLocaleTimeString(); // Current time
            chart.data.labels.push(time);
            chart.data.datasets[0].data.push(data);
            chart.update();
        }
    } else {
        console.error('One or more chart contexts are null. Ensure the canvas elements exist in the HTML.');
    }
});