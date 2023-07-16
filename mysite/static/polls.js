function updateProfile() {
    console.log('Updating profile')

    const url = "/polls/profile/edit"

    const pk = document.getElementById('id_pk').value
    const firstName = document.getElementById('id_first_name').value
    const lastName = document.getElementById('id_last_name').value
    const jobTitle = document.getElementById('id_job_title').value
    const location = document.getElementById('id_location').value

    const fetchPromise = fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            'pk': parseInt(pk),
            'first_name': firstName,
            'last_name': lastName,
            'job_title': jobTitle,
            'location': location
        }),
    })

    fetchPromise
        .then(response => {
            const data = response.json()
        })

}

function saveAnswer(pollId, answerId) {
    console.log('Saving answer')
    const url = "/polls/" + pollId + "/answers/" + answerId + "/edit"
    const value = document.getElementById('form-'+ answerId).value
    const fetchPromise = fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            'value': value
        }),
    })

    fetchPromise
        .then(response => {
            const data = response.json()
            showAnswerValue(answerId, data)
            showFlash()
            //location.reload()
        })
}

function showFlash() {
    const flashElement = document.getElementById('flash')
    flashElement.innerHTML = 'Answer updated successfully'
    flashElement.style.display = 'block'
    setTimeout(hideFlash, 1000)
}

function hideFlash() {
    const flashElement = document.getElementById('flash')
    flashElement.innerHTML = ''
    flashElement.style.display = 'none'
}

function showFormInput(answer) {
    console.log(answer.value)
    const spanElement = document.getElementById('read-'+ answer.id)
    spanElement.style.display = 'none'
    const inputElement = document.getElementById('edit-'+ answer.id)
    inputElement.style.display = 'block'
    inputElement.value = answer.value
}

async function showAnswerValue(answerId, data) {
    const inputElement = document.getElementById('edit-'+ answerId)
    inputElement.style.display = 'none'
    const valueElement = document.getElementById('value-'+ answerId)
    valueElement.innerHTML = (await data).value
    const spanElement = document.getElementById('read-'+ answerId)
    spanElement.style.display = 'block'
}
