const progressBar = document.querySelector('.progress-bar-inner');

function updateProgressBar(value) {
    progressBar.style.width = value + '%';
}


let cpu_data = [];
function get_system_info(){
    try { 
    fetch('http://127.0.0.1:5000/api/v1/system')
    .then(response => response.json())
    .then((data) => {
        const cpu_load_element = document.getElementById('cpu_load')
        const mem_free_element = document.getElementById('mem_free')
        const mem_used_element = document.getElementById('mem_used')

        cpu_load_element.textContent = "Загрузка ЦП: " + data.cpu_load + "%";
        cpu_data.push(data.cpu_load);
        if (cpu_data.length > 60){
            cpu_data.shift();
        }
        updateProgressBar(data.cpu_load)
        mem_free_element.textContent = "Свободно ОЗУ: " + data.mem_free + " МБ"; 
        mem_used_element.textContent = "Занято ОЗУ: " + data.mem_used + " МБ";
    });
    
    }
    catch (error) {
    console.log("Возникла проблема с api-запросом: ", error.message);
    }
}
get_system_info()
let update_info = setInterval(() => get_system_info(), 1000)

const ctx = document.getElementById('myChart');
const chart = new Chart(ctx, {
    type: 'line',
    options:{
            aspectRatio: 1,
            scales: {x:{
                max: 60
                }, 
                y:
                {max:100
                }
            },
            plugins: {
                legend: {
                    display: false,
                }
            }
        },
    data: {
        labels: [ ...Array(60).keys() ].map( i => i+1),
        datasets: [{
        data: cpu_data.reverse(),
        borderWidth: 1,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        pointStyle: false,
        
        
        }]
    },
});

let update_chart = setInterval(() => chart.update(), 1000)