import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import axios from 'axios';
import * as mapColombiaData from './municipios.geo.json';

@Component({
  selector: 'app-map-colombia',
  templateUrl: './map-colombia.component.html',
  styleUrls: ['./map-colombia.component.css'],
})
export class MapColombiaComponent implements OnInit {
  chartInstance: any;
  chartDepartmentInstance: any;
  mapData: any;
  departmentsData: any;
  municipalityData: any;
  departmentsMapData: any;

  ngOnInit() {
    this.getDepartmentData();
    this.getmunicipalityData();
    this.loadMapData('00');
  }

  loadMapData(mapId: string) {
    this.chartInstance = null;
    axios.get(`./assets/json/${mapId}.geojson`).then((response) => {
      this.mapData = response.data;
      echarts.registerMap('colombia', this.mapData);
      this.renderMap();
    });
  }

  getDepartmentData() {
    //simulacion de datos de departamentos traidos desde un api simulamos que el resultado sea el del JSON de departamentos
    axios.get(`./assets/json/departamentos.json`).then((response) => {
      this.departmentsData = response.data;
    });
  }
  getmunicipalityData() {
    //simulacion de datos de departamentos traidos desde un api simulamos que el resultado sea el del JSON de departamentos
    axios.get(`./assets/json/municipios.json`).then((response) => {
      this.municipalityData = response.data;
    });
  }

  loadDepartmentsMapData(mapId: string) {
    this.chartDepartmentInstance = null;
    axios.get(`./assets/json/${mapId}.geojson`).then((response) => {
      echarts.registerMap('departments', response.data);
      this.renderDepartmentsMap();
    });
  }

  renderMap() {
    const chartDom = document.getElementById('colombia-map')!;
    this.chartInstance = echarts.init(chartDom);

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const stateData = this.departmentsData.find(
            (department: any) => department.name === params.name
          );
          const properties = stateData;
          if (properties) {
            // Datos que deseas mostrar, sin el nombre del departamento
            const area = properties.AREA
              ? (properties.AREA / 1000000).toFixed(2)
              : 'No disponible'; // Convertimos a km²
            const perimeter = properties.PERIMETER
              ? (properties.PERIMETER / 1000).toFixed(2)
              : 'No disponible'; // Convertimos a km
            const hectares = properties.HECTARES
              ? properties.HECTARES.toFixed(2)
              : 'No disponible'; // Hectáreas

            // Retorna solo los datos que quieres mostrar en el tooltip
            return `
        <div>
          Área: ${area} km²<br/>
          Perímetro: ${perimeter} km<br/>
          Hectáreas: ${hectares} ha
        </div>
      `;
          } else {
            return 'Información no disponible';
          }
        },
      },
      series: [
        {
          type: 'map',
          map: 'colombia',
          roam: true, // Habilitar zoom y desplazamiento
          zoom: 1.2, // Nivel inicial de zoom
          itemStyle: {
            emphasis: { label: { show: false } },
          },
        },
      ],
    };
    this.chartInstance.setOption(option);
    // Detectar clics en el mapa
    this.chartInstance.on('click', (params: any) => {
      //this.loadMapData(params.name); si quieren reusar el mismo mapa para mostrar es departamento seleccionado deben decomentar esta linea y comentar la siguiente linea 108
      this.loadDepartmentsMapData(params.name);
    });
  }
  renderDepartmentsMap() {
    const chartDom = document.getElementById('departments-map')!;
    this.chartDepartmentInstance = echarts.init(chartDom);

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const municipalityResult = this.municipalityData.find(
            (municipality: any) => municipality.name === params.name
          );
          const properties = municipalityResult;
          if (properties) {
            const { MPIO_CRSLC, MPIO_CCNCT, NOMBRE } = properties;

            // Retorna los datos del tooltip
            return `
              <div>
                <strong>Departamento: ${NOMBRE}</strong><br/>
                Ordenanza: ${MPIO_CRSLC}<br/>
                Código: ${MPIO_CCNCT}<br/>
              </div>
            `;
          } else {
            // Si no hay propiedades disponibles
            return 'Información no disponible';
          }
        },
      },
      series: [
        {
          type: 'map',
          map: 'departments',
          roam: true, // Habilitar zoom y desplazamiento
          zoom: 1.2, // Nivel inicial de zoom
          itemStyle: {
            emphasis: { label: { show: false } },
          },
        },
      ],
    };
    this.chartDepartmentInstance.setOption(option);
    // Detectar clics en el mapa
    this.chartDepartmentInstance.on('click', (params: any) => {
      //Al dar click en el departamento podemos controlar lo que queremos hacer con ese evento en este caso buscamos en el json de municipios la informacion que queremos mostrar
      const municipalityResult = this.municipalityData.find(
        (municipality: any) => municipality.name === params.name
      );
      const { DPTO_CCDGO, MPIO_CCDGO, name, MPIO_CRSLC, MPIO_NAREA, NOMBRE } =
        municipalityResult;
      alert(
        `Código departamento: ${DPTO_CCDGO}\n Código municipio: ${MPIO_CCDGO}\n Código en el mapa: ${name}\n Ordenanza: ${MPIO_CRSLC}\n Area: ${MPIO_NAREA}\n Nombre del municipio: ${NOMBRE}\n`
      );
    });
  }
}
