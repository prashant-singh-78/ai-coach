import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { Radar, Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const Result = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get(`/interview/${id}/report`);
        setReport(res.data);
      } catch (error) {
        console.error("Report fetch error", error);
      }
      setLoading(false);
    };
    fetchReport();
  }, [id]);

  if (loading) return <div className="flex justify-center items-center h-full py-20">Loading Report...</div>;
  if (!report) return <div className="text-center py-20">Report not found</div>;

  const radarData = {
    labels: ['Overall', 'Grammar', 'Communication', 'Confidence', 'Technical', 'STAR Method'],
    datasets: [
      {
        label: 'Score (out of 10)',
        data: [
          report.overall_score, 
          report.grammar_score, 
          report.communication_score, 
          report.confidence_score, 
          report.technical_score, 
          report.star_method_score
        ],
        backgroundColor: 'rgba(14, 165, 233, 0.2)',
        borderColor: 'rgba(14, 165, 233, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(14, 165, 233, 1)',
      },
    ],
  };

  const radarOptions = {
    scales: { r: { min: 0, max: 10, ticks: { stepSize: 2 } } }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Interview Report</h1>
        <Link to="/dashboard" className="text-primary-600 hover:underline font-medium">Back to Dashboard</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Radar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1 bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex flex-col items-center">
           <h3 className="text-lg font-semibold text-slate-800 mb-4 w-full">Performance Metrics</h3>
           <div className="w-full max-w-sm">
             <Radar data={radarData} options={radarOptions} />
           </div>
           <div className="mt-8 text-center">
             <p className="text-5xl font-extrabold text-primary-600">{report.overall_score.toFixed(1)}</p>
             <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold mt-1">Overall Score</p>
           </div>
        </motion.div>

        {/* Text Feedback */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Feedback Summary</h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{report.feedback_summary}</p>
          </div>
          
          <div className="bg-white border border-amber-200 p-8 rounded-xl shadow-sm bg-amber-50/30">
            <h3 className="text-lg font-semibold text-amber-900 mb-3">Improvement Suggestions</h3>
            <p className="text-amber-800 leading-relaxed whitespace-pre-wrap">{report.improvement_suggestions}</p>
          </div>
          
          <div className="bg-white border border-green-200 p-8 rounded-xl shadow-sm bg-green-50/30">
            <h3 className="text-lg font-semibold text-green-900 mb-3">Next Learning Path</h3>
            <p className="text-green-800 leading-relaxed whitespace-pre-wrap">{report.next_learning_path}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Result;
