function assignEditEvents() {
  for (let el of document.getElementsByClassName('edit_button')) {
    el.addEventListener('click', (e) => {
      console.log(e.target.id);
      alert(`Elemento con ID ${e.target.id} clickeado`);
      e.preventDefault();
    });
  }
}

async function getTeachers() {
  const response = await fetch("http://localhost:3001/teachers");
  const teachers = await response.json();
  console.log('teachers:', teachers);

  if (teachers) {
    const container = document.getElementById('result');
    container.innerHTML = '';

    teachers.forEach((teacher) => {
      const row = document.createElement('tr');

      row.innerHTML = `
        <td>${teacher.first_name}</td>
        <td>${teacher.last_name}</td>
        <td>${teacher.cedula}</td>
        <td>${teacher.age}</td>
      `;
      container.appendChild(row);
    });

    assignEditEvents();
  }
}

async function createTeacher() {
  let teacher = {
    first_name: document.getElementById('first_name').value,
    last_name: document.getElementById('last_name').value,
    cedula: document.getElementById('cedula').value,
    age: document.getElementById('age').value
  };

  const response = await fetch("http://localhost:3001/teachers", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(teacher)
  });

  if (response && response.status == 201) {
    teacher = await response.json();
    console.log('Profesor guardado:', teacher);
    alert('Profesor guardado correctamente');
  } else {
    alert("Ocurrió un error al guardar el profesor.");
  }
}