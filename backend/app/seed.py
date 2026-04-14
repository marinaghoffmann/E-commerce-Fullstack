"""
Script de seed: popula o banco de dados com os dados dos CSVs.
Uso: python -m app.seed --data-dir ./data
"""
import argparse
import os
import pandas as pd
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models import Consumidor, Produto, Vendedor, Pedido, ItemPedido, AvaliacaoPedido
from app.database import Base


def seed(data_dir: str):
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        arquivos = {
            "consumidores": os.path.join(data_dir, "dim_consumidores.csv"),
            "produtos":     os.path.join(data_dir, "dim_produtos.csv"),
            "vendedores":   os.path.join(data_dir, "dim_vendedores.csv"),
            "pedidos":      os.path.join(data_dir, "fat_pedidos.csv"),
            "itens":        os.path.join(data_dir, "fat_itens_pedidos.csv"),
            "avaliacoes":   os.path.join(data_dir, "fat_avaliacoes_pedidos.csv"),
        }

        # Consumidores
        if os.path.exists(arquivos["consumidores"]):
            df = pd.read_csv(arquivos["consumidores"])
            count = 0
            for _, row in df.iterrows():
                if not db.get(Consumidor, row["id_consumidor"]):
                    db.add(Consumidor(**row.to_dict()))
                    count += 1
            db.commit()
            print(f"✅ Consumidores: {count} inseridos de {len(df)}")

        # Vendedores
        if os.path.exists(arquivos["vendedores"]):
            df = pd.read_csv(arquivos["vendedores"])
            count = 0
            for _, row in df.iterrows():
                if not db.get(Vendedor, row["id_vendedor"]):
                    db.add(Vendedor(**row.to_dict()))
                    count += 1
            db.commit()
            print(f"✅ Vendedores: {count} inseridos de {len(df)}")

        # Produtos
        if os.path.exists(arquivos["produtos"]):
            df = pd.read_csv(arquivos["produtos"])
            count = 0
            for _, row in df.iterrows():
                if not db.get(Produto, row["id_produto"]):
                    db.add(Produto(**{
                        k: (None if pd.isna(v) else v)
                        for k, v in row.to_dict().items()
                    }))
                    count += 1
            db.commit()
            print(f"✅ Produtos: {count} inseridos de {len(df)}")

        # Pedidos
        if os.path.exists(arquivos["pedidos"]):
            df = pd.read_csv(arquivos["pedidos"])
            count = 0
            for _, row in df.iterrows():
                if not db.get(Pedido, row["id_pedido"]):
                    db.add(Pedido(**{
                        k: (None if pd.isna(v) else v)
                        for k, v in row.to_dict().items()
                    }))
                    count += 1
            db.commit()
            print(f"✅ Pedidos: {count} inseridos de {len(df)}")

        # Itens de Pedido
        if os.path.exists(arquivos["itens"]):
            df = pd.read_csv(arquivos["itens"])
            count = 0
            for _, row in df.iterrows():
                exists = db.get(ItemPedido, (row["id_pedido"], int(row["id_item"])))
                if not exists:
                    db.add(ItemPedido(**{
                        k: (None if pd.isna(v) else v)
                        for k, v in row.to_dict().items()
                    }))
                    count += 1
            db.commit()
            print(f"✅ Itens de Pedido: {count} inseridos de {len(df)}")

        # Avaliações
        if os.path.exists(arquivos["avaliacoes"]):
            df = pd.read_csv(arquivos["avaliacoes"])
            count = 0
            for _, row in df.iterrows():
                if not db.get(AvaliacaoPedido, row["id_avaliacao"]):
                    db.add(AvaliacaoPedido(**{
                        k: (None if pd.isna(v) else v)
                        for k, v in row.to_dict().items()
                    }))
                    count += 1
            db.commit()
            print(f"✅ Avaliações: {count} inseridas de {len(df)}")

        print("\n🎉 Seed concluído com sucesso!")

    except Exception as e:
        db.rollback()
        print(f"❌ Erro durante o seed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-dir", default="./data", help="Pasta com os CSVs")
    args = parser.parse_args()
    seed(args.data_dir)
