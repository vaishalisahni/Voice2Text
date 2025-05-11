import { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2, Sparkles, HelpCircle } from 'lucide-react';

export default function GrievanceGenerator() {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isMicAvailable, setIsMicAvailable] = useState(true);
  const [category, setCategory] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [categoryOptions] = useState([
    'Water Supply Issues', 
    'Sanitation Problems', 
    'Road & Transport', 
    'Electricity', 
    'Waste Management',
    'Drainage Issues',
    'Public Safety',
    'Other'
  ]);

  useEffect(() => {
    // Check if browser supports SpeechRecognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      
      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setText(prevText => {
          // Only append if this is a new chunk of text
          if (!prevText.endsWith(transcript)) {
            return prevText + ' ' + transcript;
          }
          return prevText;
        });
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setIsMicAvailable(false);
        }
      };

      recognitionInstance.onend = () => {
        if (isListening) {
          recognitionInstance.start();
        }
      };

      setRecognition(recognitionInstance);
    } else {
      setIsMicAvailable(false);
      console.error('Speech recognition not supported in this browser');
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const generateGrievance = () => {
    if (!text.trim()) {
      alert("Please describe your issue first using voice or by typing");
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate AI processing with a timeout (replace with actual API call)
    setTimeout(() => {
      const grievanceTemplates = {
        "Water Supply Issues": `
Water supply issue in [location]:

${text}

This issue has persisted for [time period] and affects approximately [number] households in the area. Residents are experiencing [low water pressure/complete outage/contaminated water/irregular supply] which has resulted in [difficulty performing daily tasks/health concerns/need to purchase bottled water/other impacts].

Previous complaints were registered on [date] but the issue remains unresolved. The suspected cause may be [pipeline damage/maintenance work/low reservoir levels/pump failure] based on [observations].

The water supply department should inspect the water lines in the area, identify the root cause, implement necessary repairs, and restore proper water supply within [timeframe]. Regular updates on the progress should be communicated to affected residents.`,

        "Sanitation Problems": `
Sanitation issue in [location]:

${text}

This sanitation problem has existed for [time period] and poses significant health risks to residents in the vicinity. The issue has led to [foul odors/mosquito breeding/disease risk/blockage of pathways].

Multiple residents have observed [specific details about the problem]. This situation worsens during [rain/heat/specific conditions] and requires immediate attention before it leads to [potential consequences].

The sanitation department should dispatch a team to clean the affected area, implement proper waste management protocols, address the underlying cause, and establish a regular maintenance schedule to prevent recurrence of this issue.`,

        "Road & Transport": `
Road and transportation issue in [location]:

${text}

This road condition problem has persisted for [time period] and poses a serious safety hazard to commuters and residents. The issue has caused [traffic congestion/accidents/vehicle damage/pedestrian difficulties].

The problem appears to be caused by [poor construction quality/lack of maintenance/heavy vehicle traffic/improper drainage] and affects a [length/area] section of the road. During [peak hours/rainy season] the situation becomes particularly dangerous.

The roads department should urgently repair the damaged sections, address the underlying causes, implement proper drainage if needed, and establish regular maintenance for this stretch of road to ensure safety and proper infrastructure.`,

        "Electricity": `
Electricity supply issue in [location]:

${text}

This electricity problem has been occurring since [time period] and is affecting [number] households/businesses in the area. Residents are experiencing [frequent outages/voltage fluctuations/partial supply/damaged lines].

The electrical issues typically occur during [specific times/weather conditions] and last for [duration]. This has resulted in [damage to appliances/disruption of essential services/business losses/inconvenience to residents].

The electricity department should conduct a thorough assessment of the local grid, repair faulty transformers or lines, address capacity issues if present, and implement measures to prevent voltage fluctuations to ensure reliable power supply to the affected area.`,

        "Waste Management": `
Waste management issue in [location]:

${text}

This waste management problem has existed for [time period] and affects [area size/number of residents]. The improper waste disposal has created [health hazards/foul smell/pest infestation/blocked pathways/environmental damage].

The municipality's waste collection service [is irregular/doesn't cover this area properly/lacks adequate capacity]. As a result, waste has accumulated to [extent of problem] and is causing significant concern among local residents.

The waste management department should immediately clear the accumulated waste, establish regular collection schedules, provide appropriate waste bins in sufficient numbers, and implement segregation protocols to better manage waste in this area.`,

        "Drainage Issues": `
Drainage issue in [location]:

${text}

This drainage problem has persisted for [time period] and worsens during [rainy season/specific conditions]. It has resulted in [waterlogging/overflow of sewage/property damage/mosquito breeding] affecting [area description].

The issue appears to be caused by [blocked drains/inadequate capacity/improper slope/damaged infrastructure] and creates significant problems for [pedestrians/vehicles/property owners/businesses] in the vicinity.

The drainage department should clear all blockages, repair damaged sections, increase drainage capacity where needed, and implement a proper maintenance schedule to prevent future occurrences of waterlogging and related issues.`,

        "Public Safety": `
Public safety hazard in [location]:

${text}

This safety hazard has existed for [time period] and poses significant risk to [residents/pedestrians/children/elderly] in the area. There have already been [number/description of incidents] reported due to this issue.

The hazard is particularly concerning due to [proximity to school/hospital/busy intersection/residential area]. The risk increases during [specific times/conditions] and requires immediate intervention.

The public safety department should install proper safety measures including [barriers/signs/lighting/repairs], conduct regular inspections, address the root cause of the hazard, and implement preventive measures to ensure the safety of all citizens in this area.`,

        "Other": `
Public infrastructure issue in [location]:

${text}

This issue has been ongoing for [time period] and is negatively impacting [description of affected population/area]. The problem has resulted in [specific consequences/inconveniences/risks] to local residents.

Based on observation, the possible causes include [potential causes] which require professional assessment. Previous attempts to address this through [informal means/lodging complaints] have not resolved the situation.

The appropriate municipal department should investigate this issue, determine the exact cause, implement necessary repairs or improvements, establish preventive measures, and ensure proper functioning of public infrastructure in this area.`
      };

      const selectedCategory = category || "Other";
      
      // Generate the grievance text based on the template and user input
      const generatedText = grievanceTemplates[selectedCategory].trim();
      
      setText(generatedText);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200 rounded-t-lg">
          <h3 className="text-lg font-medium text-gray-700">AI Grievance Generator</h3>
          <div className="flex items-center">
            {!isMicAvailable && (
              <span className="text-red-500 text-sm mr-2">Microphone access denied</span>
            )}
            <button
              onClick={toggleListening}
              disabled={!isMicAvailable}
              className={`p-2 rounded-full focus:outline-none ${
                isListening ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
              } ${!isMicAvailable ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-80'}`}
              title={isListening ? "Stop listening" : "Start listening"}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <label className="block text-sm font-medium text-gray-700">Category:</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Select a category</option>
              {categoryOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <div className="relative group">
              <HelpCircle size={16} className="text-gray-500" />
              <div className="absolute left-0 bottom-full mb-2 w-64 bg-black text-white text-xs rounded p-2 hidden group-hover:block shadow-lg">
                Selecting a category helps generate a more specific grievance format
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Describe your issue here... (e.g., 'There's a water supply disruption on Main Street affecting 40 households for the past three days')"
            className="w-full p-4 min-h-32 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-b-lg"
            rows={12}
          />
          
          {isListening && (
            <div className="absolute bottom-4 right-4 flex items-center justify-center">
              <div className="relative">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {isListening ? (
            <p className="text-green-600 flex items-center">
              <span className="h-2 w-2 bg-green-600 rounded-full mr-2 animate-pulse"></span>
              Listening... Speak now
            </p>
          ) : (
            <p>Describe your issue using voice or typing</p>
          )}
        </div>
        
        <button
          onClick={generateGrievance}
          disabled={isGenerating}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Grievance
            </>
          )}
        </button>
      </div>
    </div>
  );
}