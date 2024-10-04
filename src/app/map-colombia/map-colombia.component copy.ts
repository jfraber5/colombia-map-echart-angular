import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as echarts from 'echarts';
import axios from 'axios';

@Component({
  standalone: true,
  selector: 'app-map-colombia',
  templateUrl: './map-colombia.component.html',
  styleUrls: ['./map-colombia.component.css'],
})
export class MapColombiaComponent implements OnInit {
  chartInstance: any;
  mapData: any;
  currentZoom: string | null = null;

  constructor() {}

  ngOnInit(): void {
    this.loadMapData();
  }

  // Cargar los datos del mapa (GeoJSON)
  loadMapData() {
    axios.get('./assets/json/00.geojson').then((response) => {
      this.mapData = response.data;
      echarts.registerMap('colombia', this.mapData);
      this.initChart();
    });
    /**this.http.get('assets/json/colombia.geo.json').subscribe((geoJson) => {
      this.mapData = geoJson;
      echarts.registerMap('colombia', this.mapData);
      this.initChart();
    });**/
  }

  // Inicializar el gráfico de ECharts
  initChart() {
    const chartDom = document.getElementById('colombia-map')!;
    this.chartInstance = echarts.init(chartDom);

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}', // Mostrará el nombre del departamento o municipio al pasar el cursor.
      },
      series: [
        {
          name: 'Colombia',
          type: 'map',
          map: 'colombia', // Usamos el nombre registrado en el GeoJSON
          roam: true, // Habilitar zoom y desplazamiento
          zoom: 1.2, // Nivel inicial de zoom
          emphasis: {
            label: {
              show: true,
            },
          },
          // Los departamentos se definen como regiones, pero podrías cargarlos dinámicamente
          data: this.getDepartmentData(),
        },
      ],
    };

    this.chartInstance.setOption(option);

    // Detectar clics en el mapa
    this.chartInstance.on('click', (params: any) => {
      console.log(params);

      if (this.currentZoom === null) {
        // Al hacer clic en un departamento, hacer zoom y mostrar municipios
        //this.zoomInDepartment(params);
      } else {
        // Al hacer clic en un municipio, obtener su ID
        this.onMunicipioClick(params);
      }
    });
  }

  // Obtener los datos de los departamentos (simulación)
  getDepartmentData() {
    return [
      { name: 'Antioquia', value: 'ANT' },
      { name: 'Bogotá', value: 'BOG' },
      // Agrega más departamentos...
    ];
  }

  // Al hacer clic en un departamento
  zoomInDepartment(params: any) {
    const departamentoId = params.data.value; // ID del departamento clicado

    this.currentZoom = departamentoId;

    // Aquí deberías actualizar el mapa para mostrar solo los municipios del departamento seleccionado
    // En este ejemplo, volvemos a generar el mapa para simular el zoom
    const municipioData = this.getMunicipiosByDepartment(departamentoId);

    this.chartInstance.setOption({
      series: [
        {
          name: 'Municipios',
          type: 'map',
          map: 'colombia',
          roam: true,
          emphasis: {
            label: {
              show: true,
            },
          },
          data: municipioData,
        },
      ],
    });

    console.log(`Departamento clicado: ${departamentoId}`);
    this.sendToAPI(departamentoId); // Enviar ID a la API
  }

  // Obtener municipios de un departamento (simulación)
  getMunicipiosByDepartment(departmentId: string) {
    if (departmentId === 'ANT') {
      return [
        { name: 'Medellín', value: 'MDE' },
        { name: 'Envigado', value: 'ENV' },
        // Agrega más municipios...
      ];
    } else if (departmentId === 'BOG') {
      return [
        { name: 'Bogotá', value: 'BOG' },
        // Agrega más municipios...
      ];
    }
    return [];
  }

  // Al hacer clic en un municipio
  onMunicipioClick(params: any) {
    const municipioId = params.data.value;
    console.log(`Municipio clicado: ${municipioId}`);
    this.sendToAPI(municipioId); // Enviar ID a la API
  }

  // Enviar ID del departamento o municipio a la API
  sendToAPI(id: string) {
    axios
      .post('https://mi-api.com/entidad', { id: id })
      .then((response) => {
        console.log('Datos enviados a la API:', response.data);
      })
      .catch((error) => {
        console.error('Error al enviar los datos:', error);
      });
  }
}
