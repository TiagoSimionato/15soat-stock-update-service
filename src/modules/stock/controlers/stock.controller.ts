import type { Response } from 'express';
import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Post, Put, Res } from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { StockDTO, StockResponse } from '../models/stock.model';
import { StockService } from '../services/stock.service';

@Controller('stocks')
export class StockController {
  constructor(
    @Inject()
    private readonly stockService: StockService,
  ) { }

  @Post()
  async createResource(@Body() stock: StockDTO, @Res() res: Response) {
    await this.stockService.createStock(stock);
    return res.status(201).send({ message: 'Estoque atualizado com sucesso.' });
  }

  @Get()
  async listAllStocks(@Res() res: Response) {
    const arrStocks: StockResponse[] = await this.stockService.listStocks();
    return res.status(200).send(arrStocks);
  }

  @Get('/:id')
  async listStockByStockId(@Param('id', ParseIntPipe) resourceId: number, @Res() res: Response) {
    const stock: null | StockResponse = await this.stockService.listStockByStockId(resourceId);
    if (!stock)
      return res.status(404).send({ message: 'Recurso não foi encontrado.' });

    return res.status(200).send(stock);
  }

  @Get('/resource/:id')
  async listStockByResourceId(@Param('id', ParseIntPipe) resourceId: number, @Res() res: Response) {
    const stock: null | StockResponse = await this.stockService.listStockByResourceId(resourceId);
    if (!stock)
      return res.status(404).send({ message: 'Recurso não foi encontrado.' });

    return res.status(200).send(stock);
  }

  @Put(':id')
  async updateStock(@Param('id', ParseIntPipe) stockId: number, @Body() stock: StockDTO, @Res() res: Response) {
    const update: UpdateResult = await this.stockService.updateStock(stockId, stock);
    if (update.affected === 0)
      return res.status(404).send({ message: 'Estoque não foi encontrado.' });

    res.status(201).send({ message: 'Estoque atualizado com sucesso.' });
  }

  @Delete(':id')
  async deleteStock(@Param('id', ParseIntPipe) stockId: number, @Res() res: Response) {
    const deleted: DeleteResult = await this.stockService.deleteStock(stockId);
    if (deleted.affected === 0)
      return res.status(404).send({ message: 'Estoque não foi encontrado.' });

    return res.status(200).send({ message: 'Estoque deletado com sucesso.' });
  }
}
