let doctors = [];

document.getElementById("addDoctor").addEventListener("click", () => {
  const nameInput = document.getElementById("doctorName");
  const name = nameInput.value.trim();
  if (name) {
    doctors.push({ name, points: 0 });
    const li = document.createElement("li");
    li.textContent = name;
    document.getElementById("doctorList").appendChild(li);
    nameInput.value = "";
  }
});

document.getElementById("generateCalendar").addEventListener("click", () => {
  generateCalendar();
});

// Add keybind for Enter key on the 'doctorName' input field
document.getElementById("doctorName").addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("addDoctor").click();
    document.getElementById("doctorName").focus();
  }
});

// Add list of Tunisian public holidays (format: 'MM-DD')
const tunisianHolidays = [
  "01-01", // New Year's Day
  "03-20", // Independence Day
  "03-30", // Eid al-Fitr
  "03-31", // Eid al-Fitr
  "05-01", // Labor Day
  "06-06", // Eid al-Adha
  "06-07", // Eid al-Adha
  "06-26", // Ras as-Sanah al-Hijriyah
  "04-09", // Martyrs' Day
  "09-04", // Mouled (Prophet Muhammad's Birthday)
  "07-25", // Republic Day
  "08-13", // Women's Day
  "10-15", // Evacuation Day
  "12-17", // National Day
  // Add more holidays as needed
];

function isPublicHoliday(date) {
  const monthDay = `${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
  return tunisianHolidays.includes(monthDay);
}

function generateCalendar() {
  // Check if there are at least two doctors
  if (doctors.length < 2) {
    alert("Il faut au moins deux médecins pour assigner une garde.");
    return;
  }

  const calendarView = document.getElementById("calendarView"); // Updated ID
  calendarView.innerHTML = ""; // Clear previous calendar
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayName = date.toLocaleDateString("fr-FR", { weekday: "long" });
    const dayElement = document.createElement("div");
    dayElement.classList.add("day");
    dayElement.innerHTML = `<strong>${dayName} ${day}/${
      month + 1
    }</strong><br/>`;

    // Assign two doctors
    const assignedDoctors = assignDoctors(date);
    assignedDoctors.forEach((doc) => {
      dayElement.innerHTML += `${doc.name}<br/>`;
    });

    calendarView.appendChild(dayElement);
  }

  updatePointsDisplay();
}

function assignDoctors(date) {
  // Sort doctors by points
  doctors.sort((a, b) => a.points - b.points);
  const assigned = [];

  for (let i = 0; i < 2; i++) {
    const doctor = doctors[i];
    assigned.push(doctor);

    // Update points based on the day
    if (isPublicHoliday(date)) {
      doctor.points += 2;
    } else {
      const day = date.getDay(); // 0 = Sunday, 6 = Saturday
      if (day >= 1 && day <= 5) {
        // Monday to Friday
        doctor.points += 1;
      } else if (day === 6) {
        // Saturday
        doctor.points += 1.5;
      } else {
        // Sunday
        doctor.points += 2;
      }
    }
  }

  return assigned;
}

function updatePointsDisplay() {
  const pointsList = document.getElementById("pointsList");
  pointsList.innerHTML = ""; // Clear previous points

  doctors.forEach((doc) => {
    const li = document.createElement("li");
    li.textContent = `${doc.name}: ${doc.points} points`;
    pointsList.appendChild(li);
  });
}

function printSection(sectionId) {
  const sections = ['doctor-input', 'calendar', 'doctor-points'];
  const printSection = document.getElementById(sectionId);
  const otherSections = sections.filter(id => id !== sectionId).map(id => document.getElementById(id));

  // Add 'printable' class to the desired section
  printSection.classList.add('printable');

  // Remove 'printable' class from other sections
  otherSections.forEach(section => section.classList.remove('printable'));

  // Trigger print after allowing DOM to update
  setTimeout(() => {
      window.print();

      // Remove 'printable' class after printing
      printSection.classList.remove('printable');
  }, 100);
}

// Function to print the Liste des Médecins
document.getElementById("printDoctorsList").addEventListener("click", () => {
  printSection("doctor-input");
});

// Function to print the Calendrier
document.getElementById("printCalendar").addEventListener("click", () => {
  printSection("calendar");
});

// Function to print the Points des Médecins
document.getElementById("printPointsList").addEventListener("click", () => {
  printSection("doctor-points");
});
