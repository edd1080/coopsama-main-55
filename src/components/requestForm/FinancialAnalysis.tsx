
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calculator, TrendingUp, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface FinancialAnalysisProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const expenseCategories = [
  { key: 'alimentacion', label: 'Alimentación', defaultValue: '1200.00' },
  { key: 'vestuario', label: 'Vestuario', defaultValue: '0.00' },
  { key: 'serviciosBasicos', label: 'Servicios Básicos', defaultValue: '200.00' },
  { key: 'educacion', label: 'Educación', defaultValue: '0.00' },
  { key: 'vivienda', label: 'Vivienda', defaultValue: '0.00' },
  { key: 'transporte', label: 'Transporte', defaultValue: '200.00' },
  { key: 'compromisos', label: 'Compromisos', defaultValue: '0.00' },
  { key: 'gastosFinancieros', label: 'Gastos Financieros', defaultValue: '394.00' },
  { key: 'descuentosPlanilla', label: 'Descuentos de Planilla', defaultValue: '0.00' },
  { key: 'otros', label: 'Otros', defaultValue: '0.00' }
];

const FinancialAnalysis: React.FC<FinancialAnalysisProps> = ({ formData, updateFormData }) => {
  // Initialize default values if not present
  React.useEffect(() => {
    expenseCategories.forEach(category => {
      if (!formData[category.key]) {
        updateFormData(category.key, category.defaultValue);
      }
    });
  }, []);

  // Calculate totals
  const totalIncome = (parseFloat(formData.ingresoPrincipal || '0') + parseFloat(formData.ingresoSecundario || '0'));
  const totalExpenses = expenseCategories.reduce((sum, category) => {
    return sum + parseFloat(formData[category.key] || '0');
  }, 0);
  const disponibilidad = totalIncome - totalExpenses;
  const cuota = parseFloat(formData.cuotaSolicitada || '0');
  const coberturaPercent = totalIncome > 0 ? (cuota / totalIncome) * 100 : 0;

  // Traffic light logic
  const getTrafficLightStatus = () => {
    if (disponibilidad < 0) return { color: 'red', status: 'No Aplica', icon: XCircle };
    if (coberturaPercent > 70) return { color: 'red', status: 'No Aplica', icon: XCircle };
    if (coberturaPercent > 50) return { color: 'yellow', status: 'Revisar', icon: AlertCircle };
    return { color: 'green', status: 'Aplica', icon: CheckCircle };
  };

  const trafficLight = getTrafficLightStatus();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Calculator className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Análisis Financiero</h3>
      </div>

      {/* Income Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ingresos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ingresoPrincipal">Ingreso Principal</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">Q</span>
                <Input 
                  id="ingresoPrincipal"
                  className="pl-7"
                  type="number"
                  placeholder="0.00"
                  value={formData.ingresoPrincipal || ''}
                  onChange={(e) => updateFormData('ingresoPrincipal', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ingresoSecundario">Ingreso Secundario (Opcional)</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">Q</span>
                <Input 
                  id="ingresoSecundario"
                  className="pl-7"
                  type="number"
                  placeholder="0.00"
                  value={formData.ingresoSecundario || ''}
                  onChange={(e) => updateFormData('ingresoSecundario', e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="comentarioIngreso">Comentario de referencia de fuente principal de ingresos</Label>
            <Textarea 
              id="comentarioIngreso"
              placeholder="Describa la fuente principal de sus ingresos..."
              value={formData.comentarioIngreso || ''}
              onChange={(e) => updateFormData('comentarioIngreso', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Expenses Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Gastos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {expenseCategories.map((category) => (
              <div key={category.key} className="space-y-2">
                <Label htmlFor={category.key}>{category.label}</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">Q</span>
                  <Input 
                    id={category.key}
                    className="pl-7"
                    type="number"
                    placeholder="0.00"
                    value={formData[category.key] || category.defaultValue}
                    onChange={(e) => updateFormData(category.key, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Automatic Calculations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Cálculos Automáticos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Total de Ingresos</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">Q</span>
                <Input 
                  className="pl-7 bg-muted"
                  value={totalIncome.toFixed(2)}
                  readOnly
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Total de Gastos</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">Q</span>
                <Input 
                  className="pl-7 bg-muted"
                  value={totalExpenses.toFixed(2)}
                  readOnly
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Disponibilidad</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">Q</span>
                <Input 
                  className={`pl-7 bg-muted ${disponibilidad < 0 ? 'text-destructive' : 'text-green-600'}`}
                  value={disponibilidad.toFixed(2)}
                  readOnly
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cuotaSolicitada">Cuota Solicitada</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">Q</span>
                <Input 
                  id="cuotaSolicitada"
                  className="pl-7"
                  type="number"
                  placeholder="0.00"
                  value={formData.cuotaSolicitada || ''}
                  onChange={(e) => updateFormData('cuotaSolicitada', e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Traffic Light Result */}
          <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-3">
              <trafficLight.icon 
                className={`h-6 w-6 ${
                  trafficLight.color === 'green' ? 'text-green-500' :
                  trafficLight.color === 'yellow' ? 'text-yellow-500' : 'text-red-500'
                }`}
              />
              <div>
                <p className="font-medium">Resultado del Análisis</p>
                <p className="text-sm text-muted-foreground">
                  Cobertura de cuota: {coberturaPercent.toFixed(1)}%
                </p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              trafficLight.color === 'green' ? 'bg-green-100 text-green-800' :
              trafficLight.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }`}>
              {trafficLight.status}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialAnalysis;
