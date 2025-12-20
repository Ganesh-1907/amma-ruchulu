import React, { useState } from 'react';
import { FaTimes, FaSearch, FaMapMarkerAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const MapAddressSelector = ({ onAddressSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedArea, setExpandedArea] = useState(null);

  // Nandyal (Nandhyala) locations with detailed areas and streets
  const locations = [
    {
      city: 'Nandyal',
      state: 'Andhra Pradesh',
      areas: [
        {
          name: 'Nandyal Town',
          pincode: '518501',
          streets: [
            'Main Road',
            'Gandhi Road',
            'Temple Street',
            'Bus Stand Road',
            'Railway Station Road',
            'Market Road',
            'Hospital Road',
            'College Road'
          ]
        },
        {
          name: 'Nandyal Rural',
          pincode: '518502',
          streets: [
            'Kurnool Road',
            'Mahanandi Road',
            'Belum Caves Road',
            'Agricultural Market Road',
            'Industrial Area Road',
            'New Colony Road',
            'Teachers Colony',
            'Doctors Colony'
          ]
        },
        {
          name: 'Nandyal Industrial Area',
          pincode: '518503',
          streets: [
            'Industrial Estate Road',
            'Factory Road',
            'Warehouse Road',
            'Transport Nagar',
            'Industrial Market Road',
            'Workers Colony',
            'Staff Colony',
            'Industrial Extension Road'
          ]
        },
        {
          name: 'Nandyal Educational Hub',
          pincode: '518504',
          streets: [
            'University Road',
            'College Road',
            'School Road',
            'Library Road',
            'Sports Complex Road',
            'Student Hostel Road',
            'Research Center Road',
            'Academic Block Road'
          ]
        },
        {
          name: 'Nandyal Residential Areas',
          pincode: '518505',
          streets: [
            'Housing Board Colony',
            'Teachers Colony',
            'Doctors Colony',
            'Engineers Colony',
            'Bank Colony',
            'Postal Colony',
            'Railway Colony',
            'Government Quarters'
          ]
        }
      ]
    }
  ];

  const handleLocationSelect = (city, area, street) => {
    const addressData = {
      street: street,
      area: area.name,
      city: city,
      state: locations[0].state,
      pincode: area.pincode
    };
          onAddressSelect(addressData);
    onClose();
  };

  const filteredLocations = locations.map(location => ({
    ...location,
    areas: location.areas.filter(area =>
      area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      area.streets.some(street => 
        street.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  })).filter(location => location.areas.length > 0);

  const toggleArea = (area) => {
    setExpandedArea(expandedArea === area ? null : area);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Select Your Location in Hyderabad</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
      <input
        type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for area or street in Nandyal"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {filteredLocations.map((location) => (
              <div key={location.city} className="mb-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-md">
                  <FaMapMarkerAlt className="text-primary-500 mr-2" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{location.city}</h3>
                    <p className="text-sm text-gray-500">{location.state}</p>
                  </div>
                </div>

                <div className="mt-2 space-y-2">
                  {location.areas.map((area) => (
                    <div key={area.pincode} className="border border-gray-200 rounded-md">
                      <button
                        onClick={() => toggleArea(area.name)}
                        className="w-full flex justify-between items-center p-3 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <div>
                          <div className="font-medium text-gray-900">{area.name}</div>
                          <div className="text-sm text-gray-500">Pincode: {area.pincode}</div>
                        </div>
                        {expandedArea === area.name ? (
                          <FaChevronUp className="text-gray-400" />
                        ) : (
                          <FaChevronDown className="text-gray-400" />
                        )}
                      </button>

                      {expandedArea === area.name && (
                        <div className="p-3 border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {area.streets.map((street, index) => (
                              <button
                                key={index}
                                onClick={() => handleLocationSelect(location.city, area, street)}
                                className="text-left p-2 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                              >
                                <span className="text-sm text-gray-900">{street}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {filteredLocations[0]?.areas.length === 0 && (
              <div className="text-center py-8">
                <FaMapMarkerAlt className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No locations found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try searching with a different term
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapAddressSelector; 