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
        <td>
          <a href="editTeacher.html?id=${teacher._id}" class="btn btn-warning btn-sm">Editar</a>
          <button class="btn btn-danger btn-sm" onclick="deleteTeacher('${teacher._id}')">Eliminar</button>
        </td>
      `;
      container.appendChild(row);
    });
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
    window.location.href = 'showTeachers.html';
  } else {
    alert("Ocurrió un error al guardar el profesor.");
  }
}

async function loadTeacherForEdit(teacherId) {
  const response = await fetch(`http://localhost:3001/teachers/?id=${teacherId}`);
  const teacher = await response.json();

  if (teacher) {
    document.getElementById('edit_first_name').value = teacher.first_name;
    document.getElementById('edit_last_name').value = teacher.last_name;
    document.getElementById('edit_cedula').value = teacher.cedula;
    document.getElementById('edit_age').value = teacher.age;
    document.getElementById('edit_teacher_id').value = teacher._id;
  }
}

async function updateTeacher() {
  const teacherId = document.getElementById('edit_teacher_id').value;

  let updatedTeacher = {
    first_name: document.getElementById('edit_first_name').value,
    last_name: document.getElementById('edit_last_name').value,
    cedula: document.getElementById('edit_cedula').value,
    age: document.getElementById('edit_age').value
  };

  const response = await fetch(`http://localhost:3001/teachers/${teacherId}`, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedTeacher)
  });

  if (response && response.status == 200) {
    alert('Profesor actualizado correctamente');
    window.location.href = 'showTeachers.html';
  } else {
    alert("Ocurrió un error al actualizar el profesor.");
  }
}

async function deleteTeacher(teacherId) {
  const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este profesor?');
  if (confirmDelete) {
    const response = await fetch(`http://localhost:3001/teachers/${teacherId}`, {
      method: "DELETE"
    });

    if (response && response.status == 200) {
      alert('Profesor eliminado correctamente');
      getTeachers();
    } else {
      alert("Ocurrió un error al eliminar el profesor.");
    }
  }
}

// Funciones para Cursos

async function getCourses() {
  const response = await fetch("http://localhost:3001/courses");
  const courses = await response.json();
  console.log('courses:', courses);

  if (courses) {
    const container = document.getElementById('result');
    container.innerHTML = '';

    courses.forEach((course) => {
      const row = document.createElement('tr');

      row.innerHTML = `
        <td>${course.name}</td>
        <td>${course.code}</td>
        <td>${course.description}</td>
        <td>${course.credits}</td>
        <td>${course.teacher ? course.teacher.first_name + ' ' + course.teacher.last_name : 'Sin profesor'}</td>
        <td>
          <a href="editCourse.html?id=${course._id}" class="btn btn-warning btn-sm">Editar</a>
          <button class="btn btn-danger btn-sm" onclick="deleteCourse('${course._id}')">Eliminar</button>
        </td>
      `;
      container.appendChild(row);
    });
  }
}

async function createCourse() {
  let course = {
    name: document.getElementById('name').value,
    code: document.getElementById('code').value,
    description: document.getElementById('description').value,
    credits: document.getElementById('credits').value,
    teacher: document.getElementById('teacher').value
  };

  const response = await fetch("http://localhost:3001/courses", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(course)
  });

  if (response && response.status == 201) {
    course = await response.json();
    console.log('Curso guardado:', course);
    alert('Curso guardado correctamente');
    window.location.href = 'showCourses.html';
  } else {
    alert("Ocurrió un error al guardar el curso.");
  }
}

async function loadTeachersForCourse() {
  const response = await fetch("http://localhost:3001/teachers");
  const teachers = await response.json();

  if (teachers) {
    const teacherSelect = document.getElementById('teacher');
    teacherSelect.innerHTML = '<option value="">Seleccione un profesor</option>';

    teachers.forEach((teacher) => {
      const option = document.createElement('option');
      option.value = teacher._id;
      option.textContent = `${teacher.first_name} ${teacher.last_name}`;
      teacherSelect.appendChild(option);
    });
  }
}

async function loadCourseForEdit(courseId) {
  const response = await fetch(`http://localhost:3001/courses/?id=${courseId}`);
  const course = await response.json();

  if (course) {
    document.getElementById('edit_name').value = course.name;
    document.getElementById('edit_code').value = course.code;
    document.getElementById('edit_description').value = course.description;
    document.getElementById('edit_credits').value = course.credits;
    document.getElementById('edit_course_id').value = course._id;
    
    const teacherResponse = await fetch("http://localhost:3001/teachers");
    const teachers = await teacherResponse.json();
    
    if (teachers) {
      const teacherSelect = document.getElementById('edit_teacher');
      teacherSelect.innerHTML = '<option value="">Seleccione un profesor</option>';

      teachers.forEach((teacher) => {
        const option = document.createElement('option');
        option.value = teacher._id;
        option.textContent = `${teacher.first_name} ${teacher.last_name}`;
        teacherSelect.appendChild(option);
      });
      if (course.teacher) {
        teacherSelect.value = course.teacher._id;
      }
    }
  }
}

async function updateCourse() {
  const courseId = document.getElementById('edit_course_id').value;

  let updatedCourse = {
    name: document.getElementById('edit_name').value,
    code: document.getElementById('edit_code').value,
    description: document.getElementById('edit_description').value,
    credits: document.getElementById('edit_credits').value,
    teacher: document.getElementById('edit_teacher').value
  };

  const response = await fetch(`http://localhost:3001/courses/${courseId}`, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedCourse)
  });

  if (response && response.status == 200) {
    alert('Curso actualizado correctamente');
    window.location.href = 'showCourses.html';
  } else {
    alert("Ocurrió un error al actualizar el curso.");
  }
}

async function deleteCourse(courseId) {
  const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este curso?');
  if (confirmDelete) {
    const response = await fetch(`http://localhost:3001/courses/${courseId}`, {
      method: "DELETE"
    });

    if (response && response.status == 200) {
      alert('Curso eliminado correctamente');
      getCourses();
    } else {
      alert("Ocurrió un error al eliminar el curso.");
    }
  }
}