import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AxiosInstance from '../Axios/Axios';

const AddDetails = ({ patientId }) => {
  // Initial form data with default values
  const initialFormData = {
    patientId: patientId,
    description: "",
    treatment: "",
    diagnosis: "",
    symptoms: ""
  };

  // State to manage form input values
  const [formData, setFormData] = useState(initialFormData);
  // State to manage form visibility
  const [showForm, setShowForm] = useState(false);
  // State to check if the form is in editing mode
  const [isEditing, setIsEditing] = useState(false);

  // Fetch existing data if available
  useEffect(() => {
    AxiosInstance.get(`patient_description/${patientId}/`)
      .then(response => {
        const { data } = response;
        if (data) {
          // Populate formData with existing data if available
          setFormData({
            patientId: data.patientId,
            description: data.description || "",
            treatment: data.treatment || "",
            diagnosis: data.diagnosis || "",
            symptoms: data.symptoms || ""
          });
          // Check if any field other than patientId has data to determine editing
          const { patientId, ...formDataWithoutId } = data;
          const hasData = Object.values(formDataWithoutId).some(value => value !== '');
          setIsEditing(hasData);
        }
      })
      .catch(error => {
        console.error("Error fetching patient data:", error);
      });
  }, [patientId]);

  // Handle changes in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      // Submit data to update existing record
      AxiosInstance.put(`patient_description/${patientId}/`, formData)
        .then(response => {
          console.log("Data updated successfully:", response.data);
          setShowForm(false); // Close the form after saving
        })
        .catch(error => {
          console.error("Error updating data:", error);
        });
    } else {
      // Submit data to create new record
      AxiosInstance.post(`patient_description/`, formData)
        .then(response => {
          console.log("Data saved successfully:", response.data);
          setShowForm(false); // Close the form after saving
        })
        .catch(error => {
          console.error("Error saving data:", error);
        });
    }
  };

  // Handle form close
  const onClose = () => {
    setShowForm(false);
  };

  return (
    <div>
      <div className='flex justify-end'>
        <button
          onClick={() => setShowForm(true)}
          className={`bg-${isEditing ? 'blue' : 'green'}-500 hover:bg-${isEditing ? 'blue' : 'green'}-700 text-white font-bold py-2 px-4 m-6 rounded-lg`}
        >
          {isEditing ? 'Edit Description' : 'Add Description'}
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Patient Description' : 'Add Patient Description'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Treatment</label>
                <textarea
                  name="treatment"
                  value={formData.treatment}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Diagnosis</label>
                {/* Diagnosis field is a select dropdown */}
                <select
                  id="diagnosis"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2"
                >
                  <option value="">--Diagnosis--</option>
                  <option value="Head Injury">Head Injury</option>
                  <option value="Spinal Injury">Spinal Injury</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Symptoms</label>
                <textarea
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  className="border rounded-lg w-full p-2"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={() => {
                    window.location.reload(); // Reload the page after form submission
                  }}
                  className={`bg-${isEditing ? 'blue' : 'green'}-500 hover:bg-${isEditing ? 'blue' : 'green'}-700 text-white font-bold py-2 px-4 rounded-lg`}
                >
                  {isEditing ? 'Save' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddDetails;