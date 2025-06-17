const progressBar = document.querySelector('.progress-bar-inner');

function updateProgressBar(value) {
    progressBar.style.width = value + '%';
}

function get_containers(){
  const html_container = document.getElementById('items_container');
  const items = [];
    fetch('http://localhost:5000/api/v1/docker/containers')
    .then(response => response.json())
    .then(data => {
        html_container.innerHTML = '';
        const containers = Object.entries(data).map(([id, container_data]) => ({
        id: id,
        name: container_data[0],
        status: container_data[1],
        full_id: container_data[2]
        }));

        containers.forEach(item => {
        const div = document.createElement('div');
        div.innerHTML = `
          <input type="hidden" id="${item["id"]}" name="items" value="${item["id"]}">
          <label for="${item["id"]}"><span class="container-id">${item["id"]}</span></label>
          <button onclick="showContainerDetails(${JSON.stringify(item).replace(/"/g, '&quot;')})">Свойства</button>
        `;
        if (!document.getElementById(item["id"])){
          html_container.appendChild(div);
        }
      });
    });  
}

function showContainerDetails(containerData) {
  const modal = document.getElementById('containerModal');
  const details = document.getElementById('containerDetails');
  
  details.innerHTML = `
    <p><strong>Id:</strong> ${containerData.id}</p>
    <p><strong>Название:</strong> ${containerData.name}</p>
    <p><strong>Статус:</strong><span id="current-status" class="status status-${containerData.status}"> ${containerData.status}</span></p>
    <button onclick="containerAction('${containerData.id}', 'start')">Start</button>
    <button onclick="containerAction('${containerData.id}', 'stop')">Стоп</button>
    <button onclick="containerAction('${containerData.id}', 'restart')">Рестарт</button>
  `;
  modal.style.display = 'block';
}



function containerAction(containerId, action) {
  const statusSpan = document.getElementById('current-status');
   if (action === 'start') {
        statusSpan.textContent = 'starting...';
    } else if (action === 'stop') {
        statusSpan.textContent = 'stopping...';
    } else if (action === 'restart') {
        statusSpan.textContent = 'restarting...';
    }
  statusSpan.className = 'status status-loading';
  
  fetch(`http://localhost:5000/api/v1/docker/containers/${containerId}/${action}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      container_id: containerId
    })
  })

  .then(response => {
    if (response.ok) {
      console.log(`${action} выполнен успешно`);
      get_containers();
    } else {
      console.error('Ошибка:', response.status);
    }
  })

  .then(data => {
    let newStatus;
    if (action === 'start' || action === 'restart') {
            newStatus = 'running';
        } else if (action === 'stop') {
            newStatus = 'stopped';
        }
        statusSpan.textContent = newStatus;
        statusSpan.className = `status status-${newStatus}`;
    if (currentContainerData && currentContainerData.id === containerId) {
          currentContainerData.status = newStatus;}
  })

  .catch(error => console.error('Ошибка запроса:', error));
}

function getSelectedItems() {
  const checkboxes = document.querySelectorAll('input[name="items"]:checked');
  return Array.from(checkboxes).map(cb => cb.value);
}


let cpu_data = [];
function get_system_info(){
    try { 
    fetch('http://localhost:5000/api/v1/system/stats')
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




document.getElementById("scriptForm").addEventListener("submit", async (e) => {
    e.preventDefault(); 
    
    const formData = new FormData(e.target);
    
    try {
      const response = await fetch("http://localhost:5000/api/v1/scripts/run", {
        method: "POST",
        body: formData
      });
      
      const result = await response.json();
      
      if (result.status === "started") {
        alert("Скрипт успешно запущен!");
      } else {
        alert("Скрипт не был запущен (нет в whitelist)");
      }
    } catch (error) {
      alert("Ошибка при отправке запроса: " + error.message);
    }
  });


get_containers();
get_system_info()
let update_info = setInterval(() => get_system_info(), 1000);
let update_chart = setInterval(() => chart.update(), 1000);
let update_containers = setInterval(() => get_containers(), 1000);